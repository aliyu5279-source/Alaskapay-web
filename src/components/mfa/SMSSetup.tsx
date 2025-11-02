import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mfaService } from '@/services/mfaService';
import { Loader2, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SMSSetupProps {
  onComplete: () => void;
}

export function SMSSetup({ onComplete }: SMSSetupProps) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handleSetup = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your phone number',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await mfaService.setupSMS(phoneNumber);
      toast({
        title: 'Success',
        description: 'SMS authentication configured successfully'
      });
      onComplete();
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

  return (
    <div className="space-y-6">
      <Alert>
        <MessageSquare className="h-4 w-4" />
        <AlertDescription>
          SMS is a convenient backup method, but less secure than authenticator apps or security keys. Use it as a fallback option.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
        />
        <p className="text-xs text-muted-foreground">
          Include country code (e.g., +1 for US, +234 for Nigeria)
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <h4 className="font-medium">What to expect:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>You'll receive a 6-digit code via SMS when logging in</li>
          <li>Standard SMS rates may apply</li>
          <li>Codes expire after 10 minutes</li>
        </ul>
      </div>

      <Button 
        onClick={handleSetup} 
        disabled={loading || !phoneNumber.trim()}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Set Up SMS Authentication
      </Button>
    </div>
  );
}
