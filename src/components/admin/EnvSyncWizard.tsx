import { useState } from 'react';
import { CheckCircle, ArrowRight, Upload, Key, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { envSyncService, REQUIRED_ENV_VARS } from '@/services/envSyncService';
import { useToast } from '@/hooks/use-toast';

interface EnvSyncWizardProps {
  open: boolean;
  onClose: () => void;
  platform: 'vercel' | 'netlify';
}

export function EnvSyncWizard({ open, onClose, platform }: EnvSyncWizardProps) {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({ projectId: '', token: '' });
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const validation = envSyncService.validateEnvVars(
        REQUIRED_ENV_VARS.map(v => ({ ...v, present: !!envVars[v.key], value: envVars[v.key] }))
      );

      if (!validation.valid) {
        toast({
          title: 'Validation Failed',
          description: validation.errors.join(', '),
          variant: 'destructive',
        });
        return;
      }

      if (platform === 'vercel') {
        for (const [key, value] of Object.entries(envVars)) {
          await envSyncService.syncToVercel(credentials.projectId, credentials.token, { [key]: value });
        }
      } else {
        await envSyncService.syncToNetlify(credentials.projectId, credentials.token, envVars);
      }

      toast({
        title: 'Success!',
        description: `Environment variables synced to ${platform}`,
      });
      setStep(4);
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Environment Variable Setup Wizard</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 4 && <div className="w-16 h-1 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Key className="h-5 w-5" />
              Platform Credentials
            </h3>
            <div>
              <Label>Project/Site ID</Label>
              <Input
                value={credentials.projectId}
                onChange={(e) => setCredentials({ ...credentials, projectId: e.target.value })}
                placeholder={platform === 'vercel' ? 'prj_...' : 'site-id'}
              />
            </div>
            <div>
              <Label>API Token</Label>
              <Input
                type="password"
                value={credentials.token}
                onChange={(e) => setCredentials({ ...credentials, token: e.target.value })}
              />
            </div>
            <Button onClick={() => setStep(2)} className="w-full">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Environment Variables
            </h3>
            {REQUIRED_ENV_VARS.map((envVar) => (
              <div key={envVar.key}>
                <Label>{envVar.key} {envVar.required && <span className="text-red-600">*</span>}</Label>
                <Input
                  type="password"
                  value={envVars[envVar.key] || ''}
                  onChange={(e) => setEnvVars({ ...envVars, [envVar.key]: e.target.value })}
                  placeholder={envVar.description}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Review & Sync
            </h3>
            <p className="text-sm text-gray-600">
              Ready to sync {Object.keys(envVars).length} variables to {platform}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={handleSync} disabled={syncing} className="flex-1">
                {syncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold">All Set!</h3>
            <p className="text-gray-600">Environment variables synced successfully</p>
            <Button onClick={onClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
