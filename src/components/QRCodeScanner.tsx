import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrCode, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const startScan = async () => {
    toast({
      title: "QR Scanner",
      description: "QR scanning is available in the mobile app",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Scan QR Code
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          Scan a payment QR code to quickly send money or pay bills
        </p>
        <Button onClick={startScan} className="w-full">
          <QrCode className="w-4 h-4 mr-2" />
          Start Scanning
        </Button>
        <p className="text-xs text-muted-foreground">
          QR code scanning is available in the mobile app
        </p>
      </div>
    </Card>
  );
}
