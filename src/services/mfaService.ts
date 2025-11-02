import { supabase } from '@/lib/supabase';
import * as OTPAuth from 'otpauth';

export interface MFAMethod {
  id: string;
  method_type: 'totp' | 'webauthn' | 'sms' | 'backup_codes';
  method_name: string;
  is_primary: boolean;
  is_enabled: boolean;
  last_used_at?: string;
  created_at: string;
}

export interface TrustedDevice {
  id: string;
  device_name: string;
  device_fingerprint: string;
  is_trusted: boolean;
  trust_expires_at?: string;
  last_used_at: string;
}

export const mfaService = {
  // TOTP Methods
  async setupTOTP(methodName: string = 'Authenticator App') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      issuer: 'Alaska Pay',
      label: user.email || user.id,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret
    });

    const { data, error } = await supabase
      .from('mfa_methods')
      .insert({
        user_id: user.id,
        method_type: 'totp',
        method_name: methodName,
        is_enabled: false,
        totp_secret: secret.base32
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      secret: secret.base32,
      otpauth_url: totp.toString(),
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(totp.toString())}`
    };
  },

  async verifyTOTP(methodId: string, token: string) {
    const { data: method } = await supabase
      .from('mfa_methods')
      .select('*')
      .eq('id', methodId)
      .single();

    if (!method) throw new Error('Method not found');

    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(method.totp_secret)
    });

    const isValid = totp.validate({ token, window: 1 }) !== null;

    if (isValid) {
      await supabase
        .from('mfa_methods')
        .update({ is_enabled: true, last_used_at: new Date().toISOString() })
        .eq('id', methodId);
    }

    return isValid;
  },

  // WebAuthn Methods
  async registerWebAuthn(methodName: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: { name: 'Alaska Pay', id: window.location.hostname },
      user: {
        id: new TextEncoder().encode(user.id),
        name: user.email || user.id,
        displayName: user.email || user.id
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      timeout: 60000,
      attestation: 'direct'
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyOptions
    }) as PublicKeyCredential;

    const { data, error } = await supabase
      .from('mfa_methods')
      .insert({
        user_id: user.id,
        method_type: 'webauthn',
        method_name: methodName,
        is_enabled: true,
        credential_id: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        public_key: btoa(String.fromCharCode(...new Uint8Array((credential.response as any).getPublicKey())))
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // SMS Methods
  async setupSMS(phoneNumber: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('mfa_methods')
      .insert({
        user_id: user.id,
        method_type: 'sms',
        method_name: `SMS: ${phoneNumber}`,
        phone_number: phoneNumber,
        is_enabled: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Backup Codes
  async generateBackupCodes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    const hashedCodes = await Promise.all(
      codes.map(async (code) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(code);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(hash)));
      })
    );

    await supabase.from('mfa_backup_codes').delete().eq('user_id', user.id);

    const { error } = await supabase
      .from('mfa_backup_codes')
      .insert(hashedCodes.map(hash => ({ user_id: user.id, code_hash: hash })));

    if (error) throw error;

    await supabase
      .from('mfa_methods')
      .upsert({
        user_id: user.id,
        method_type: 'backup_codes',
        method_name: 'Backup Codes',
        is_enabled: true
      });

    return codes;
  },

  async getMethods() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('mfa_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MFAMethod[];
  },

  async deleteMethod(methodId: string) {
    const { error } = await supabase
      .from('mfa_methods')
      .delete()
      .eq('id', methodId);

    if (error) throw error;
  },

  // Trusted Devices
  async getTrustedDevices() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('trusted_devices')
      .select('*')
      .eq('user_id', user.id)
      .order('last_used_at', { ascending: false });

    if (error) throw error;
    return data as TrustedDevice[];
  },

  async trustDevice(deviceName: string, trustDays: number = 30) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fingerprint = await this.getDeviceFingerprint();
    const trustExpires = new Date();
    trustExpires.setDate(trustExpires.getDate() + trustDays);

    const { data, error } = await supabase
      .from('trusted_devices')
      .upsert({
        user_id: user.id,
        device_name: deviceName,
        device_fingerprint: fingerprint,
        is_trusted: true,
        trust_expires_at: trustExpires.toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async revokeDevice(deviceId: string) {
    const { error } = await supabase
      .from('trusted_devices')
      .delete()
      .eq('id', deviceId);

    if (error) throw error;
  },

  async getDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height,
      screen.colorDepth
    ];
    
    const fingerprint = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
  },

  async calculateRiskScore(): Promise<number> {
    let score = 0;
    const fingerprint = await this.getDeviceFingerprint();

    const { data: device } = await supabase
      .from('trusted_devices')
      .select('*')
      .eq('device_fingerprint', fingerprint)
      .eq('is_trusted', true)
      .single();

    if (!device) score += 50;

    const { data: recentFailures } = await supabase
      .from('mfa_authentication_logs')
      .select('*')
      .eq('success', false)
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());

    if (recentFailures && recentFailures.length > 3) score += 30;

    return Math.min(score, 100);
  }
};
