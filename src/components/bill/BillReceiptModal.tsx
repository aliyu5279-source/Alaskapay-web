import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BillTransaction {
  id: string;
  transaction_id: string;
  category: string;
  provider: string;
  customer_number: string;
  customer_name?: string;
  amount: number;
  status: string;
  created_at: string;
}

interface BillReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: BillTransaction;
}

export function BillReceiptModal({ open, onClose, transaction }: BillReceiptModalProps) {
  const handleDownload = () => {
    const receiptContent = `
AlaskaPay Bill Payment Receipt
================================

Transaction ID: ${transaction.transaction_id}
Date: ${format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm:ss')}

Category: ${transaction.category.replace('_', ' ').toUpperCase()}
Provider: ${transaction.provider}
Customer: ${transaction.customer_name || transaction.customer_number}
Customer Number: ${transaction.customer_number}

Amount: ₦${transaction.amount.toLocaleString()}
Status: ${transaction.status.toUpperCase()}

Thank you for using AlaskaPay!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill-receipt-${transaction.transaction_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">₦{transaction.amount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Payment Successful</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-medium">{transaction.transaction_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium capitalize">
                {transaction.category.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{transaction.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">
                {transaction.customer_name || transaction.customer_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
