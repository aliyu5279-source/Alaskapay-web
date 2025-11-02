import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

export function TwoFactorSettings() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  // Get IP address and device information
  const getDeviceInfo = async () => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();
      
      const device = `${navigator.platform} - ${navigator.userAgent.split(' ').slice(-2).join(' ')}`;
      const location = `${geoData.city || 'Unknown'}, ${geoData.country_name || 'Unknown'}`;
      
      return { ipAddress: ip, device, location, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        ipAddress: 'Unknown', 
        device: navigator.userAgent, 
        location: 'Unknown',
        timestamp: new Date().toISOString()
      };
    }
  };

  const checkTwoFactorStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('two_factor_auth')
        .select('enabled')
        .eq('user_id', user.id)
        .single();

      setEnabled(data?.enabled || false);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };


  const startSetup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: { userId: user.id, email: user.email }
      });

      if (error) throw error;

      setSecret(data.secret);
      setBackupCodes(data.backupCodes);
      
      const qr = await QRCode.toDataURL(data.otpauthUrl);
      setQrCode(qr);
      setSetupMode(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const verifyAndEnable = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('verify-2fa-code', {
        body: { secret, code: verificationCode, isBackupCode: false }
      });

      if (error) throw error;

      if (!data.valid) {
        toast({
          title: 'Invalid Code',
          description: 'Please check your code and try again',
          variant: 'destructive'
        });
        return;
      }

      await supabase.from('two_factor_auth').upsert({
        user_id: user.id,
        enabled: true,
        secret,
        backup_codes: backupCodes
      });

      // Send security alert for 2FA enabled
      const deviceInfo = await getDeviceInfo();
      await supabase.functions.invoke('send-security-alert', {
        body: {
          userId: user.id,
          alertType: 'two_factor_change',
          metadata: {
            action: 'enabled',
            ...deviceInfo
          }
        }
      });

      setEnabled(true);
      setSetupMode(false);
      toast({
        title: 'Success',
        description: '2FA has been enabled. A security alert has been sent to your email.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const disable2FA = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('two_factor_auth').update({
        enabled: false
      }).eq('user_id', user.id);

      // Send security alert for 2FA disabled
      const deviceInfo = await getDeviceInfo();
      await supabase.functions.invoke('send-security-alert', {
        body: {
          userId: user.id,
          alertType: 'two_factor_change',
          metadata: {
            action: 'disabled',
            ...deviceInfo
          }
        }
      });

      setEnabled(false);
      toast({
        title: 'Success',
        description: '2FA has been disabled. A security alert has been sent to your email.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const regenerateBackupCodes = async () => {
    try {
      setRegenerating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Generate new backup codes
      const newBackupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );

      // Update database with new codes
      await supabase.from('two_factor_auth').update({
        backup_codes: newBackupCodes
      }).eq('user_id', user.id);

      // Send security alert for backup codes regenerated
      const deviceInfo = await getDeviceInfo();
      await supabase.functions.invoke('send-security-alert', {
        body: {
          userId: user.id,
          alertType: 'two_factor_change',
          metadata: {
            action: 'backup_codes_regenerated',
            ...deviceInfo
          }
        }
      });

      setBackupCodes(newBackupCodes);
      toast({
        title: 'Success',
        description: 'Backup codes regenerated. A security alert has been sent to your email.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setRegenerating(false);
    }
  };


  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!setupMode && !enabled && (
          <Button onClick={startSetup}>Enable 2FA</Button>
        )}

        {!setupMode && enabled && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Two-factor authentication is currently enabled
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={regenerateBackupCodes}
                disabled={regenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                Regenerate Backup Codes
              </Button>
              <Button variant="destructive" onClick={disable2FA}>
                Disable 2FA
              </Button>
            </div>
          </div>
        )}

        {setupMode && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Step 1: Scan QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              {qrCode && <img src={qrCode} alt="QR Code" className="w-48 h-48" />}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 2: Save Backup Codes</h3>
              <p className="text-sm text-muted-foreground">
                Store these codes in a safe place. You can use them to access your account if you lose your device.
              </p>
              <div className="bg-muted p-4 rounded-md space-y-2">
                {backupCodes.map((code, i) => (
                  <div key={i} className="font-mono text-sm">{code}</div>
                ))}
                <Button size="sm" variant="outline" onClick={copyBackupCodes}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Codes'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 3: Verify</h3>
              <Label htmlFor="code">Enter 6-digit code from your app</Label>
              <Input
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
              />
              <Button onClick={verifyAndEnable}>Verify and Enable</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
