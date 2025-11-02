import { supabase } from '@/lib/supabase';

// Capacitor is optional - only available in native builds
const isNativePlatform = () => {
  try {
    return typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.() === true;
  } catch {
    return false;
  }
};

export interface BiometricDevice {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  platform: string;
  is_active: boolean;
  last_used_at: string;
}

export class BiometricService {
  // Check if biometric authentication is available
  static async isAvailable(): Promise<{ available: boolean; biometryType?: string }> {
    if (!isNativePlatform()) {
      // Check for Web Authentication API (WebAuthn)
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        return { available: true, biometryType: 'webauthn' };
      }
      return { available: false };
    }

    try {
      const { mockNativeBiometric } = await import('@/lib/capacitorMocks');
      const result = await mockNativeBiometric.NativeBiometric.isAvailable();
      return {
        available: result.isAvailable,
        biometryType: result.biometryType,
      };
    } catch (error) {
      console.error('Biometric check failed:', error);
      return { available: false };
    }

  }

  // Authenticate with biometrics
  static async authenticate(reason: string = 'Authenticate'): Promise<boolean> {
    if (!isNativePlatform()) {
      return this.authenticateWeb();
    }

    try {
      const { mockNativeBiometric } = await import('@/lib/capacitorMocks');
      await mockNativeBiometric.NativeBiometric.verifyIdentity({
        reason,
        title: 'Authentication Required',
        subtitle: 'Use biometrics to continue',
        description: reason,
      });
      return true;
    } catch (error) {
      console.error('Biometric auth failed:', error);
      return false;
    }

  }

  // Web Authentication API (WebAuthn)
  private static async authenticateWeb(): Promise<boolean> {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
        },
      });

      return !!credential;
    } catch (error) {
      console.error('WebAuthn auth failed:', error);
      return false;
    }
  }

  // Register biometric device
  // Register biometric device
  static async registerDevice(userId: string): Promise<BiometricDevice | null> {
    try {
      const { mockDevice } = await import('@/lib/capacitorMocks');
      const deviceInfo = await mockDevice.Device.getInfo();
      const deviceId = await mockDevice.Device.getId();

      const device = {
        user_id: userId,
        device_id: deviceId.identifier,
        device_name: deviceInfo.model || 'Unknown Device',
        device_type: await this.getBiometryType(),
        platform: deviceInfo.platform,
        is_active: true,
        last_used_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('biometric_devices')
        .insert(device)
        .select()
        .single();

      if (error) {
        console.error('Device registration failed:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Device registration failed:', error);
      return null;
    }
  }


  private static async getBiometryType(): Promise<string> {

    const { biometryType } = await this.isAvailable();
    return biometryType || 'unknown';
  }

  // Save credentials securely
  static async saveCredentials(username: string, password: string): Promise<boolean> {
    if (!isNativePlatform()) {
      return false;
    }

    try {
      const { mockNativeBiometric } = await import('@/lib/capacitorMocks');
      await mockNativeBiometric.NativeBiometric.setCredentials({
        username,
        password,
        server: 'alaska-pay',
      });
      return true;
    } catch (error) {
      console.error('Save credentials failed:', error);
      return false;
    }
  }

  // Get saved credentials
  static async getCredentials(): Promise<{ username: string; password: string } | null> {
    if (!isNativePlatform()) {
      return null;
    }

    try {
      const { mockNativeBiometric } = await import('@/lib/capacitorMocks');
      const credentials = await mockNativeBiometric.NativeBiometric.getCredentials({
        server: 'alaska-pay',
      });
      return credentials;
    } catch (error) {
      return null;
    }
  }

  // Delete credentials
  static async deleteCredentials(): Promise<void> {
    if (!isNativePlatform()) {
      return;
    }

    try {
      const { mockNativeBiometric } = await import('@/lib/capacitorMocks');
      await mockNativeBiometric.NativeBiometric.deleteCredentials({
        server: 'alaska-pay',
      });
    } catch (error) {
      console.error('Delete credentials failed:', error);
    }
  }




  // Log authentication attempt
  static async logAuthAttempt(
    userId: string,
    deviceId: string,
    authType: string,
    success: boolean,
    failureReason?: string
  ): Promise<void> {
    await supabase.from('biometric_auth_logs').insert({
      user_id: userId,
      device_id: deviceId,
      auth_type: authType,
      success,
      failure_reason: failureReason,
    });

    if (success) {
      await supabase
        .from('biometric_devices')
        .update({ last_used_at: new Date().toISOString() })
        .eq('device_id', deviceId)
        .eq('user_id', userId);
    }
  }

  // Get user's registered devices
  static async getDevices(userId: string): Promise<BiometricDevice[]> {
    const { data, error } = await supabase
      .from('biometric_devices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get devices failed:', error);
      return [];
    }

    return data || [];
  }

  // Revoke device
  static async revokeDevice(deviceId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('biometric_devices')
      .update({ is_active: false })
      .eq('id', deviceId)
      .eq('user_id', userId);

    return !error;
  }
}
