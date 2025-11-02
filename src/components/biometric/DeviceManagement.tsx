import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Monitor, Trash2, CheckCircle2 } from 'lucide-react';
import { BiometricDevice } from '@/services/biometricService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const DeviceManagement: React.FC = () => {
  const { getDevices, revokeDevice } = useBiometricAuth();
  const { toast } = useToast();
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BiometricDevice | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    const data = await getDevices();
    setDevices(data);
    setLoading(false);
  };

  const handleRevoke = async () => {
    if (!selectedDevice) return;

    const success = await revokeDevice(selectedDevice.id);
    if (success) {
      toast({
        title: 'Device Revoked',
        description: 'The device has been removed from your account',
      });
      loadDevices();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to revoke device',
        variant: 'destructive',
      });
    }
    setRevokeDialogOpen(false);
    setSelectedDevice(null);
  };

  const getDeviceIcon = (platform: string) => {
    if (platform === 'ios' || platform === 'android') {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div>Loading devices...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registered Devices</CardTitle>
          <CardDescription>
            Manage devices that can use biometric authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No devices registered yet
            </p>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.platform)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{device.device_name}</p>
                        {device.is_active && (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {device.device_type} • {device.platform}
                      </p>
                      {device.last_used_at && (
                        <p className="text-xs text-muted-foreground">
                          Last used: {formatDate(device.last_used_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  {device.is_active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDevice(device);
                        setRevokeDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Device Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke biometric access for "{selectedDevice?.device_name}"?
              This device will no longer be able to use biometric authentication.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke}>Revoke</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
