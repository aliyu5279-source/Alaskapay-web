import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, Trash2, Star } from 'lucide-react';

interface PaymentMethod {
  id: string;
  card_type: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  bank: string;
  is_default: boolean;
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onDelete,
  onSetDefault,
}) => {
  const cardBrandColors: Record<string, string> = {
    visa: 'bg-blue-600',
    mastercard: 'bg-orange-600',
    verve: 'bg-green-600',
  };

  const bgColor = cardBrandColors[paymentMethod.card_type.toLowerCase()] || 'bg-gray-600';

  return (
    <Card className={`${bgColor} text-white p-4`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          <div>
            <p className="text-sm font-medium uppercase">{paymentMethod.card_type}</p>
            <p className="text-xs opacity-80">{paymentMethod.bank}</p>
          </div>
        </div>
        {paymentMethod.is_default && (
          <Badge variant="secondary" className="bg-white/20">
            <Star className="h-3 w-3 mr-1" />
            Default
          </Badge>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-2xl tracking-wider">•••• •••• •••• {paymentMethod.last4}</p>
        <p className="text-sm mt-2">
          Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
        </p>
      </div>

      <div className="flex gap-2">
        {!paymentMethod.is_default && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSetDefault(paymentMethod.id)}
            className="bg-white/20 hover:bg-white/30"
          >
            Set as Default
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDelete(paymentMethod.id)}
          className="bg-red-500/20 hover:bg-red-500/30"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default PaymentMethodCard;
