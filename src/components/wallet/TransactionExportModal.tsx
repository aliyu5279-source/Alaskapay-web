import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Download, Mail, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { exportTransactionsCSV, exportTransactionsPDF } from '@/lib/transactionExportService';
import { supabase } from '@/lib/supabase';

interface TransactionExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function TransactionExportModal({ open, onOpenChange, userId }: TransactionExportModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [emailDelivery, setEmailDelivery] = useState(false);
  const [email, setEmail] = useState('');

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Missing Dates',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      });
      return;
    }

    if (emailDelivery && !email) {
      toast({
        title: 'Missing Email',
        description: 'Please enter an email address for delivery',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const filters = {
        startDate,
        endDate,
        transactionType: transactionType === 'all' ? undefined : transactionType,
      };

      let blob: Blob;
      let filename: string;

      if (format === 'csv') {
        blob = await exportTransactionsCSV(userId, filters);
        filename = `transactions_${startDate}_${endDate}.csv`;
      } else {
        blob = await exportTransactionsPDF(userId, filters);
        filename = `transactions_${startDate}_${endDate}.html`;
      }

      if (emailDelivery) {
        // Send via email using edge function
        const { error } = await supabase.functions.invoke('send-transactional-email', {
          body: {
            to: email,
            subject: 'AlaskaPay Transaction History Export',
            template: 'transaction_export',
            data: {
              startDate,
              endDate,
              format: format.toUpperCase(),
            },
          },
        });

        if (error) throw error;

        toast({
          title: 'Export Sent',
          description: `Transaction history has been sent to ${email}`,
        });
      } else {
        // Download file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Export Complete',
          description: `Transaction history downloaded as ${format.toUpperCase()}`,
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Transaction History</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Export Format</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV Spreadsheet
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Transaction Type</Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="credit">Credits Only</SelectItem>
                <SelectItem value="debit">Debits Only</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
                <SelectItem value="bill_payment">Bill Payments</SelectItem>
                <SelectItem value="card_funding">Card Funding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="email-delivery"
              checked={emailDelivery}
              onCheckedChange={(checked) => setEmailDelivery(checked as boolean)}
            />
            <Label htmlFor="email-delivery" className="cursor-pointer">
              Email me the export
            </Label>
          </div>

          {emailDelivery && (
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : emailDelivery ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send via Email
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download {format.toUpperCase()}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
