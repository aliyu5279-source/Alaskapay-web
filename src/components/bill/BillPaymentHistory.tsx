import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Mail, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNativeFeatures } from '@/hooks/useNativeFeatures';

export function BillPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { shareContent, isNative } = useNativeFeatures();


  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('bill_payments')
        .select('*, saved_billers(biller_name,account_number)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (payment: any) => {
    if (!payment.receipt_url) {
      toast.error('Receipt not available');
      return;
    }

    setDownloading(payment.id);
    try {
      const { data, error } = await supabase.storage
        .from('payment-receipts')
        .download(payment.receipt_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${payment.id}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Receipt downloaded');
    } catch (error) {
      toast.error('Failed to download receipt');
    } finally {
      setDownloading(null);
    }
  };

  const emailReceipt = async (payment: any) => {
    try {
      const { error } = await supabase.functions.invoke('send-transaction-receipt', {
        body: { paymentId: payment.id, amount: payment.amount, type: 'bill_payment' }
      });
      if (error) throw error;
      toast.success('Receipt sent to your email');
    } catch (error) {
      toast.error('Failed to send receipt');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'default',
      processing: 'secondary',
      scheduled: 'outline',
      pending_review: 'destructive',
      failed: 'destructive'
    };
    return colors[status] || 'secondary';
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No payment history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <Card key={payment.id}>
          <CardContent className="py-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-semibold">{payment.saved_billers?.biller_name}</div>
                <div className="text-sm text-muted-foreground">
                  Account: ***{payment.saved_billers?.account_number?.slice(-4)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(payment.created_at), 'MMM d, yyyy h:mm a')}
                </div>
                <div className="text-xs text-muted-foreground">
                  Fee: ${payment.fee_amount?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="font-bold text-lg">${payment.amount}</div>
                <Badge variant={getStatusColor(payment.status)}>
                  {payment.status.replace('_', ' ')}
                </Badge>
                {payment.receipt_url && payment.status === 'completed' && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadReceipt(payment)}
                      disabled={downloading === payment.id}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => emailReceipt(payment)}
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}