import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { secretsService } from '@/services/secretsService';
import { credentialValidators } from '@/lib/credentialValidators';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddSecretModal({ onClose, onSuccess }: Props) {
  const [keyName, setKeyName] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleValidate = async () => {
    setValidating(true);
    setValidationResult(null);

    try {
      let result;

      if (keyName === 'NETLIFY_AUTH_TOKEN') {
        result = await credentialValidators.validateNetlifyToken(value);
      } else if (keyName === 'SUPABASE_URL') {
        result = await credentialValidators.validateSupabaseUrl(value);
      } else if (keyName === 'SUPABASE_ANON_KEY') {
        const urlSecret = await secretsService.listSecrets();
        const supabaseUrl = urlSecret.find(s => s.key_name === 'SUPABASE_URL');
        if (supabaseUrl) {
          const url = await secretsService.getSecret(supabaseUrl.id);
          result = await credentialValidators.validateSupabaseKey(url.decrypted_value!, value);
        }
      } else if (keyName.includes('STRIPE')) {
        result = await credentialValidators.validateStripeKey(value);
      } else if (keyName.includes('SENDGRID')) {
        result = await credentialValidators.validateSendGridKey(value);
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

  const handleSave = async () => {
    if (!keyName || !value) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await secretsService.createSecret(keyName, value, description, category);
      toast.success('Secret added successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add secret');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Environment Secret</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Key Name *</Label>
            <Input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., NETLIFY_AUTH_TOKEN"
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deployment">Deployment</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Value *</Label>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter the secret value"
              rows={3}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
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
              disabled={!value || validating}
            >
              {validating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Test Connection
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Secret
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}