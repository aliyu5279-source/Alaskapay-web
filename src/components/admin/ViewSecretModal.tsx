import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { secretsService, EnvironmentSecret } from '@/services/secretsService';
import { Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  secret: EnvironmentSecret;
  onClose: () => void;
}

export function ViewSecretModal({ secret, onClose }: Props) {
  const [showValue, setShowValue] = useState(false);
  const [decryptedValue, setDecryptedValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    loadSecretValue();
    loadAuditLogs();
  }, []);

  const loadSecretValue = async () => {
    try {
      const data = await secretsService.getSecret(secret.id);
      setDecryptedValue(data.decrypted_value || '');
    } catch (error) {
      toast.error('Failed to load secret value');
    }
  };

  const loadAuditLogs = async () => {
    try {
      const logs = await secretsService.getAuditLogs(secret.id);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Failed to load audit logs');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decryptedValue);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Secret: {secret.key_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Secret Value</Label>
            <div className="flex gap-2">
              <Input
                type={showValue ? 'text' : 'password'}
                value={decryptedValue}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowValue(!showValue)}
              >
                {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <p className="text-sm text-muted-foreground">{secret.description || 'No description'}</p>
          </div>

          <div>
            <Label>Category</Label>
            <p className="text-sm text-muted-foreground capitalize">{secret.category}</p>
          </div>

          <div>
            <Label>Last Rotated</Label>
            <p className="text-sm text-muted-foreground">
              {secret.last_rotated_at 
                ? new Date(secret.last_rotated_at).toLocaleString()
                : 'Never'}
            </p>
          </div>

          <div>
            <Label>Recent Activity</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {auditLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity logs</p>
              ) : (
                auditLogs.slice(0, 10).map(log => (
                  <div key={log.id} className="text-sm p-2 bg-muted rounded">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{log.action}</span>
                      <span className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}