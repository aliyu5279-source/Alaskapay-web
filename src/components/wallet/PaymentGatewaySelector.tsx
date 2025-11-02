import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentGatewaySelectorProps {
  onSelect: (gateway: 'paystack' | 'flutterwave') => void;
  isLoading?: boolean;
}

export const PaymentGatewaySelector = ({ 
  onSelect, 
  isLoading 
}: PaymentGatewaySelectorProps) => {
  const [selected, setSelected] = useState<'paystack' | 'flutterwave' | null>(null);

  const handleSelect = (gateway: 'paystack' | 'flutterwave') => {
    setSelected(gateway);
    onSelect(gateway);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
            selected === 'paystack' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => !isLoading && handleSelect('paystack')}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold">Paystack</h4>
            <p className="text-sm text-muted-foreground">
              Pay with card, bank transfer, or USSD
            </p>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
            selected === 'flutterwave' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => !isLoading && handleSelect('flutterwave')}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="font-semibold">Flutterwave</h4>
            <p className="text-sm text-muted-foreground">
              Multiple payment options available
            </p>
          </div>
        </Card>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Initializing payment...
        </p>
      )}
    </div>
  );
};