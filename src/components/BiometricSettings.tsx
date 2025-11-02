import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Fingerprint, Shield, Lock, Timer, Smartphone } from 'lucide-react';
import { useAppLock, LockTimeout } from '@/hooks/useAppLock';
import { DeviceManagement } from '@/components/biometric/DeviceManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export const BiometricSettings: React.FC = () => {
  const { user } = useAuth();
  const { isAvailable, biometryType, authenticate, deleteCredentials, registerDevice } = useBiometricAuth();
  const { lockTimeout, rememberDevice, updateTimeout, updateRememberDevice } = useAppLock();
  const { toast } = useToast();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [transactionAuthEnabled, setTransactionAuthEnabled] = useState(false);
  const [biometricTransactionAuth, setBiometricTransactionAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [hasPIN, setHasPIN] = useState(false);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('biometric_enabled, transaction_auth_enabled, biometric_transaction_auth, has_pin')
      .eq('id', user.id)
      .single();

    if (data) {
      setBiometricEnabled(data.biometric_enabled || false);
      setTransactionAuthEnabled(data.transaction_auth_enabled || false);
      setBiometricTransactionAuth(data.biometric_transaction_auth || false);
      setHasPIN(data.has_pin || false);
    }
  };


  const handleBiometricToggle = async (enabled: boolean) => {
    if (!user) return;

    if (enabled) {
      const authenticated = await authenticate('Enable biometric login');
      if (!authenticated) return;

      await supabase
        .from('profiles')
        .update({ biometric_enabled: true })
        .eq('id', user.id);

      setBiometricEnabled(true);
      toast({ title: 'Success', description: 'Biometric login enabled' });
    } else {
      await deleteCredentials();
      await supabase
        .from('profiles')
        .update({ biometric_enabled: false })
        .eq('id', user.id);

      setBiometricEnabled(false);
      toast({ title: 'Success', description: 'Biometric login disabled' });
    }
  };

  const handleTransactionAuthToggle = async (enabled: boolean) => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ transaction_auth_enabled: enabled })
      .eq('id', user.id);

    setTransactionAuthEnabled(enabled);
    toast({
      title: 'Success',
      description: enabled ? 'Transaction auth enabled' : 'Transaction auth disabled',
    });
  };

  const handleBiometricTransactionAuthToggle = async (enabled: boolean) => {
    if (!user) return;

    if (enabled) {
      const authenticated = await authenticate('Enable biometric transaction verification');
      if (!authenticated) return;
    }

    await supabase
      .from('profiles')
      .update({ biometric_transaction_auth: enabled })
      .eq('id', user.id);

    setBiometricTransactionAuth(enabled);
    toast({
      title: 'Success',
      description: enabled 
        ? 'Biometric transaction verification enabled' 
        : 'Biometric transaction verification disabled',
    });
  };


  const handleSetPIN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      toast({ title: 'Error', description: 'PIN must be 4 digits', variant: 'destructive' });
      return;
    }

    if (pin !== confirmPin) {
      toast({ title: 'Error', description: 'PINs do not match', variant: 'destructive' });
      return;
    }

    setLoading(true);
    localStorage.setItem('userPin', pin);
    
    const { error } = await supabase
      .from('profiles')
      .update({ pin_hash: pin, has_pin: true })
      .eq('id', user.id);


    setLoading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setHasPIN(true);
    setPin('');
    setConfirmPin('');
    toast({ title: 'Success', description: 'PIN set successfully' });
  };

  const getBiometryName = () => {
    switch (biometryType) {
      case 0: return 'Touch ID';
      case 1: return 'Face ID';
      case 2: return 'Fingerprint';
      case 3: return 'Face Authentication';
      case 4: return 'Iris Authentication';
      default: return 'Biometric';
    }
  };

  if (!isAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>Not available on this device</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="settings" className="space-y-4">
      <TabsList>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="devices">
          <Smartphone className="h-4 w-4 mr-2" />
          Devices
        </TabsTrigger>
      </TabsList>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              {getBiometryName()}
            </CardTitle>
            <CardDescription>Secure your account with biometric authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable {getBiometryName()}</Label>
                <p className="text-sm text-muted-foreground">Use biometrics to log in</p>
              </div>
              <Switch checked={biometricEnabled} onCheckedChange={handleBiometricToggle} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transaction Authentication</Label>
                <p className="text-sm text-muted-foreground">Require auth for transactions over $500</p>
              </div>
              <Switch checked={transactionAuthEnabled} onCheckedChange={handleTransactionAuthToggle} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Use {getBiometryName()} for Transactions</Label>
                <p className="text-sm text-muted-foreground">
                  Verify transfers, withdrawals, and payments with {getBiometryName()}
                </p>
              </div>
              <Switch 
                checked={biometricTransactionAuth} 
                onCheckedChange={handleBiometricTransactionAuthToggle} 
              />
            </div>

          </CardContent>

        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              PIN Fallback
            </CardTitle>
            <CardDescription>Set a 4-digit PIN as backup authentication</CardDescription>
          </CardHeader>
          <CardContent>
            {hasPIN ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                PIN is configured
              </div>
            ) : (
              <form onSubmit={handleSetPIN} className="space-y-4">
                <div>
                  <Label htmlFor="pin">PIN (4 digits)</Label>
                  <Input
                    id="pin"
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4-digit PIN"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPin">Confirm PIN</Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Confirm PIN"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Setting PIN...' : 'Set PIN'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              App Lock Settings
            </CardTitle>
            <CardDescription>Configure when the app requires authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lockTimeout">Lock Timeout</Label>
              <Select value={lockTimeout} onValueChange={(value) => updateTimeout(value as LockTimeout)}>
                <SelectTrigger id="lockTimeout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediately</SelectItem>
                  <SelectItem value="1min">After 1 minute</SelectItem>
                  <SelectItem value="5min">After 5 minutes</SelectItem>
                  <SelectItem value="15min">After 15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Remember This Device</Label>
                <p className="text-sm text-muted-foreground">Don't lock app on this trusted device</p>
              </div>
              <Switch checked={rememberDevice} onCheckedChange={updateRememberDevice} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="devices">
        <DeviceManagement />
      </TabsContent>
    </Tabs>
  );
};
