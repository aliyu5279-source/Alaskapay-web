import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mfaService } from '@/services/mfaService';
import { Loader2, Download, Copy, Check, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BackupCodesSetupProps {
  onComplete: () => void;
}

export function BackupCodesSetup({ onComplete }: BackupCodesSetupProps) {
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const backupCodes = await mfaService.generateBackupCodes();
      setCodes(backupCodes);
      toast({
        title: 'Backup Codes Generated',
        description: 'Save these codes in a secure location'
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

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Backup codes copied to clipboard'
    });
  };

  const handleDownload = () => {
    const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alaska-pay-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (codes.length === 0) {
    return (
      <div className="space-y-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Backup codes let you access your account if you lose access to your other MFA methods. Each code can only be used once.
          </AlertDescription>
        </Alert>

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Backup Codes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertDescription>
          Save these codes now! You won't be able to see them again. Each code can only be used once.
        </AlertDescription>
      </Alert>

      <div className="bg-muted p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          {codes.map((code, index) => (
            <div key={index} className="p-2 bg-background rounded">
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleCopy} variant="outline" className="flex-1">
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          Copy
        </Button>
        <Button onClick={handleDownload} variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <Button onClick={onComplete} className="w-full">
        I've Saved My Codes
      </Button>
    </div>
  );
}
