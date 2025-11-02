import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { secretsService, EnvironmentSecret } from '@/services/secretsService';
import { credentialValidators } from '@/lib/credentialValidators';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  secret: EnvironmentSecret;
  onClose: () => void;
  onSuccess: () => void;
}

export function RotateSecretModal({ secret, onClose, onSuccess }: Props) {
  const [newValue, setNewValue] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [rotating, setRotating] = useState(false);

  const handleValidate = async () => {
    setValidating(true);
    setValidationResult(null);

    try {
      let result;

      if (secret.key_name === 'NETLIFY_AUTH_TOKEN') {
        result = await credentialValidators.validateNetlifyToken(newValue);
      } else if (secret.key_name === 'SUPABASE_URL') {
        result = await credentialValidators.validateSupabaseUrl(newValue);
      } else if (secret.key_name.includes('STRIPE')) {
        result = await credentialValidators.validateStripeKey(newValue);
      } else if (secret.key_name.includes('SENDGRID')) {
        result = await credentialValidators.validateSendGridKey(newValue);
      } else {
        result = { isValid: true, message: 'No validation available for this key type' };
      }

      setValidationResult(result);
      
      if (result.isValid) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Validation failed');
    } finally {
      setValidating(false);
    }
  };

  const handleRotate = async () => {
    if (!newValue) {
      toast.error('Please enter a new value');
      return;
    }

    setRotating(true);
    try {
      await secretsService.rotateSecret(secret.id, newValue);
      toast.success('Secret rotated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to rotate secret');
    } finally {
      setRotating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rotate Secret: {secret.key_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 text-yellow-900 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Warning</div>
              <div>Rotating this secret will invalidate the old value. Make sure to update all services using this secret.</div>
            </div>
          </div>

          <div>
            <Label>New Secret Value *</Label>
            <Textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter the new secret value"
              rows={3}
            />
          </div>

          {validationResult && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              validationResult.isValid ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
            }`}>
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <div>
                <div className="font-medium">{validationResult.message}</div>
                {validationResult.responseTime && (
                  <div className="text-sm">Response time: {validationResult.responseTime}ms</div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              variant="outline"
              onClick={handleValidate}
              disabled={!newValue || validating}
            >
              {validating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Test New Value
            </Button>
            <Button onClick={handleRotate} disabled={rotating || !newValue}>
              {rotating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Rotate Secret
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}