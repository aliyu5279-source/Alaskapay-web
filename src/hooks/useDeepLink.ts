import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deepLinkHandler, DeepLinkData } from '@/lib/deepLinkHandler';
import { useToast } from '@/hooks/use-toast';

export function useDeepLink() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    deepLinkHandler.initialize();

    const handleDeepLink = (data: DeepLinkData) => {
      const { path, params, queryParams } = data;

      // Handle payment links
      if (params.paymentId) {
        navigate('/dashboard', {
          state: {
            openPayment: true,
            paymentId: params.paymentId,
            amount: queryParams.amount,
            recipient: queryParams.to
          }
        });
        toast({
          title: "Payment Request",
          description: "Opening payment details..."
        });
      }
      
      // Handle card links
      else if (params.cardId) {
        navigate('/dashboard', {
          state: {
            openCard: true,
            cardId: params.cardId
          }
        });
      }
      
      // Handle bill payment links
      else if (params.billId) {
        navigate('/dashboard', {
          state: {
            openBill: true,
            billId: params.billId,
            amount: queryParams.amount
          }
        });
      }
      
      // Handle referral links
      else if (params.referralCode) {
        localStorage.setItem('referralCode', params.referralCode);
        navigate('/signup', {
          state: { referralCode: params.referralCode }
        });
        toast({
          title: "Referral Link",
          description: "Sign up to get your referral bonus!"
        });
      }
      
      // Handle transfer links
      else if (params.recipient) {
        navigate('/dashboard', {
          state: {
            openTransfer: true,
            recipient: params.recipient,
            amount: params.amount
          }
        });
      }
    };

    deepLinkHandler.addListener(handleDeepLink);

    return () => {
      deepLinkHandler.removeListener(handleDeepLink);
    };
  }, [navigate, toast]);
}
