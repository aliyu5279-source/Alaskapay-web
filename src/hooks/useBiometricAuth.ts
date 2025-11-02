import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BiometricService } from '@/services/biometricService';
import { useAuth } from '@/contexts/AuthContext';

const isNativePlatform = () => {
  try {
    return typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.() === true;
  } catch {
    return false;
  }
};

export const useBiometricAuth = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    const result = await BiometricService.isAvailable();
    setIsAvailable(result.available);
    setBiometryType(result.biometryType || null);
  };

  const authenticate = async (reason: string = 'Authenticate'): Promise<boolean> => {
    if (!isAvailable) {
      toast({
        title: 'Not Available',
        description: 'Biometric authentication is not available on this device',
        variant: 'destructive',
      });
      return false;
    }

    const success = await BiometricService.authenticate(reason);
    
    if (user && isNativePlatform()) {
      try {
        const { mockDevice } = await import('@/lib/capacitorMocks');
        const deviceId = await mockDevice.Device.getId();
        await BiometricService.logAuthAttempt(
          user.id,
          deviceId.identifier,
          'authentication',
          success,
          success ? undefined : 'User cancelled or failed'
        );
      } catch (error) {
        console.error('Failed to log auth attempt:', error);
      }
    }



    return success;
  };


  const saveCredentials = async (username: string, password: string): Promise<boolean> => {
    return await BiometricService.saveCredentials(username, password);
  };

  const getCredentials = async (): Promise<{ username: string; password: string } | null> => {
    return await BiometricService.getCredentials();
  };

  const deleteCredentials = async () => {
    await BiometricService.deleteCredentials();
  };

  const registerDevice = async () => {
    if (!user) return null;
    return await BiometricService.registerDevice(user.id);
  };

  const getDevices = async () => {
    if (!user) return [];
    return await BiometricService.getDevices(user.id);
  };

  const revokeDevice = async (deviceId: string) => {
    if (!user) return false;
    return await BiometricService.revokeDevice(deviceId, user.id);
  };

  return {
    isAvailable,
    biometryType,
    authenticate,
    saveCredentials,
    getCredentials,
    deleteCredentials,
    registerDevice,
    getDevices,
    revokeDevice,
  };
};
