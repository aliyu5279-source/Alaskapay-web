import React from 'react';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptTemplateProps {
  transaction: any;
}

const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ transaction }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: transaction?.currency || 'NGN'
    }).format(amount);
  };

  return (
    <div className="bg-white p-8 rounded-lg border">
      {/* Header */}
      <div className="text-center mb-6 border-b pb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Alaska Pay</h1>
        <p className="text-sm text-gray-600">Payment Receipt</p>
        <div className="flex items-center justify-center mt-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <p className="text-lg font-semibold mt-2 text-green-600">Payment Successful</p>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Transaction ID:</span>
          <span className="font-mono font-semibold">{transaction?.id || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Date & Time:</span>
          <span className="font-semibold">
            {transaction?.created_at ? format(new Date(transaction.created_at), 'PPpp') : 'N/A'}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Type:</span>
          <span className="font-semibold capitalize">{transaction?.type || 'Payment'}</span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Status:</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            {transaction?.status || 'Completed'}
          </span>
        </div>

        {transaction?.description && (
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Description:</span>
            <span className="font-semibold text-right">{transaction.description}</span>
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg text-gray-700">Amount Paid:</span>
          <span className="text-3xl font-bold text-blue-600">
            {formatCurrency(transaction?.amount || 0)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t">
        <p>Thank you for using Alaska Pay</p>
        <p className="mt-2">For support, contact: support@alaskapay.com</p>
        <p className="mt-4 text-xs">This is an automated receipt. No signature required.</p>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
