import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mfaService, MFAMethod, TrustedDevice } from '@/services/mfaService';
import { MFASetupWizard } from './MFASetupWizard';
import { Smartphone, Key, MessageSquare, Shield, Trash2, Plus, Laptop } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function MFAManagement() {
  const [methods, setMethods] = useState<MFAMethod[]>([]);
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [methodsData, devicesData] = await Promise.all([
        mfaService.getMethods(),
        mfaService.getTrustedDevices()
      ]);
      setMethods(methodsData);
      setDevices(devicesData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await mfaService.deleteMethod(deleteTarget);
      toast({ title: 'Method removed successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
    setDeleteTarget(null);
  };

  const handleRevokeDevice = async (deviceId: string) => {
    try {
      await mfaService.revokeDevice(deviceId);
      toast({ title: 'Device revoked successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'totp': return <Smartphone className="w-5 h-5" />;
      case 'webauthn': return <Key className="w-5 h-5" />;
      case 'sms': return <MessageSquare className="w-5 h-5" />;
      case 'backup_codes': return <Shield className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Authentication Methods</CardTitle>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {methods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getMethodIcon(method.method_type)}
                <div>
                  <p className="font-medium">{method.method_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {method.last_used_at ? `Last used: ${new Date(method.last_used_at).toLocaleDateString()}` : 'Never used'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.is_primary && <Badge>Primary</Badge>}
                {method.is_enabled ? <Badge variant="outline">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(method.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {methods.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No authentication methods configured</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trusted Devices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5" />
                <div>
                  <p className="font-medium">{device.device_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Last used: {new Date(device.last_used_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRevokeDevice(device.id)}>
                Revoke
              </Button>
            </div>
          ))}
          {devices.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No trusted devices</p>
          )}
        </CardContent>
      </Card>

      <MFASetupWizard
        open={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={() => {
          setShowWizard(false);
          loadData();
        }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Authentication Method?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this authentication method. Make sure you have another method configured.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
