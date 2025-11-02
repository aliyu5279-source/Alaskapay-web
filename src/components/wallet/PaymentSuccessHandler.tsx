import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const PaymentSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const checkPayment = async () => {
      const reference = searchParams.get('reference') || searchParams.get('tx_ref');
      const paymentStatus = searchParams.get('status');

      if (!reference) {
        setStatus('failed');
        setMessage('No payment reference found');
        return;
      }

      try {
        // Check transaction status in database
        const { data: transaction, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('reference', reference)
          .single();

        if (error) throw error;

        if (transaction.status === 'completed') {
          setStatus('success');
          setMessage('Payment successful! Your wallet has been credited.');
          toast.success('Wallet topped up successfully!');
        } else if (transaction.status === 'failed') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
          toast.error('Payment failed');
        } else {
          // Still pending, wait for webhook
          setMessage('Payment is being processed. This may take a few moments...');
          
          // Poll for updates
          setTimeout(checkPayment, 3000);
        }
      } catch (error) {
        setStatus('failed');
        setMessage('Error verifying payment');
        toast.error('Failed to verify payment');
      }
    };

    if (searchParams.get('payment') === 'success') {
      checkPayment();
    }
  }, [searchParams]);

  if (searchParams.get('payment') !== 'success') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 text-center space-y-4">
        {status === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
            <h2 className="text-xl font-semibold">{message}</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="text-xl font-semibold text-green-600">Payment Successful!</h2>
            <p className="text-muted-foreground">{message}</p>
            <Button onClick={() => navigate('/wallet')} className="w-full">
              View Wallet
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-red-500" />
            <h2 className="text-xl font-semibold text-red-600">Payment Failed</h2>
            <p className="text-muted-foreground">{message}</p>
            <Button onClick={() => navigate('/wallet')} variant="outline" className="w-full">
              Back to Wallet
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};