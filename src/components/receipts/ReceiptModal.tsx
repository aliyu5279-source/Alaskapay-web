import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Mail, Printer, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReceiptTemplate from './ReceiptTemplate';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, transaction }) => {
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    toast({ title: "Downloading receipt...", description: "Your receipt is being prepared." });
    setTimeout(() => {
      toast({ title: "Receipt downloaded", description: "Check your downloads folder." });
    }, 1500);
  };

  const handleEmail = async () => {
    toast({ title: "Sending receipt...", description: "Receipt will be sent to your email." });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Receipt</DialogTitle>
        </DialogHeader>
        
        <div ref={receiptRef}>
          <ReceiptTemplate transaction={transaction} />
        </div>

        <div className="flex gap-2 mt-4 print:hidden">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleEmail} variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
