import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mfaService } from '@/services/mfaService';
import { Loader2, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WebAuthnSetupProps {
  onComplete: () => void;
}

export function WebAuthnSetup({ onComplete }: WebAuthnSetupProps) {
  const [loading, setLoading] = useState(false);
  const [keyName, setKeyName] = useState('');
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!keyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your security key',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await mfaService.registerWebAuthn(keyName);
      toast({
        title: 'Success',
        description: 'Security key registered successfully'
      });
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to register security key',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          Security keys provide the highest level of protection. You'll need a physical device like YubiKey or your device's built-in biometric authentication.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="keyName">Security Key Name</Label>
        <Input
          id="keyName"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="e.g., YubiKey 5, Touch ID"
        />
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <h4 className="font-medium">Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Click the button below to start registration</li>
          <li>Insert your security key if it's a USB device</li>
          <li>Follow your browser's prompts to complete registration</li>
          <li>Touch your security key when prompted</li>
        </ol>
      </div>

      <Button 
        onClick={handleRegister} 
        disabled={loading || !keyName.trim()}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Register Security Key
      </Button>
    </div>
  );
}
