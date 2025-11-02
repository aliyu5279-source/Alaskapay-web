import { useState, useEffect } from 'react';
import { verifyTransaction } from '@/services/paystackService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function usePaystackVerification() {
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    
    if (reference) {
      verifyPayment(reference);
    }
  }, []);

  const verifyPayment = async (reference: string) => {
    setVerifying(true);
    try {
      const result = await verifyTransaction(reference);
      
      if (result.status && result.data?.status === 'success') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Update transaction
        await supabase
          .from('transactions')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('reference', reference);

        // Credit wallet
        await supabase.rpc('credit_wallet', {
          p_user_id: user.id,
          p_amount: result.data.amount / 100
        });

        toast({
          title: 'Payment Successful',
          description: `₦${(result.data.amount / 100).toLocaleString()} added to your wallet`
        });

        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        toast({
          title: 'Payment Failed',
          description: 'Transaction could not be verified',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Verification Error',
        description: 'Failed to verify payment',
        variant: 'destructive'
      });
    } finally {
      setVerifying(false);
    }
  };

  return { verifying, verifyPayment };
}
