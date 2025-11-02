import React, { useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { savePaymentMethod } from '@/services/paymentMethodService';

interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddCard = async () => {
    if (!user?.email) {
      setError('User email not found');
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError('Paystack not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: user.email,
        amount: 50 * 100,
        currency: 'NGN',
        ref: `card_auth_${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: 'Purpose',
              variable_name: 'purpose',
              value: 'Card Authorization'
            }
          ]
        },
        onClose: () => {
          setLoading(false);
        },
        callback: async (response: any) => {
          try {
            await savePaymentMethod(user.id, response.authorization);
            toast({
              title: 'Success',
              description: 'Card added successfully'
            });
            onSuccess();
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
      });
      handler.openIframe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          A temporary charge of ₦50 will be made to verify your card. 
          This amount will be refunded immediately.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2">
        <Button onClick={handleAddCard} disabled={loading} className="flex-1">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-4 w-4" />
          )}
          Add Card with Paystack
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddPaymentMethodForm;
