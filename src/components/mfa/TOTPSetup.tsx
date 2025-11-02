import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mfaService } from '@/services/mfaService';
import { Loader2, Copy, Check } from 'lucide-react';

interface TOTPSetupProps {
  onComplete: () => void;
}

export function TOTPSetup({ onComplete }: TOTPSetupProps) {
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await mfaService.setupTOTP();
      setSetupData(data);
      setStep('verify');
      toast({
        title: 'QR Code Generated',
        description: 'Scan the QR code with your authenticator app'
      });
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

  const handleVerify = async () => {
    setLoading(true);
    try {
      const isValid = await mfaService.verifyTOTP(setupData.id, verificationCode);
      if (isValid) {
        toast({
          title: 'Success',
          description: 'Authenticator app configured successfully'
        });
        onComplete();
      } else {
        toast({
          title: 'Invalid Code',
          description: 'Please check the code and try again',
          variant: 'destructive'
        });
      }
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

  const copySecret = () => {
    navigator.clipboard.writeText(setupData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'generate') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use an authenticator app like Google Authenticator, Authy, or 1Password to scan the QR code.
        </p>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate QR Code
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <img src={setupData.qr_code_url} alt="QR Code" className="w-64 h-64" />
        
        <div className="w-full">
          <Label>Or enter this code manually:</Label>
          <div className="flex gap-2 mt-2">
            <Input value={setupData.secret} readOnly className="font-mono" />
            <Button variant="outline" size="icon" onClick={copySecret}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Enter 6-digit code from your app</Label>
        <Input
          id="code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="text-center text-2xl tracking-widest"
          maxLength={6}
        />
      </div>

      <Button 
        onClick={handleVerify} 
        disabled={loading || verificationCode.length !== 6}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify and Enable
      </Button>
    </div>
  );
}
