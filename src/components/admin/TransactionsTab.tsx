import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logAdminAction } from '@/lib/auditLogger';
import { useToast } from '@/hooks/use-toast';

const TransactionsTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([
    { id: '1', user: 'John Doe', type: 'Data Purchase', amount: 2000, status: 'pending', date: '2025-10-05' },
    { id: '2', user: 'Jane Smith', type: 'Airtime', amount: 500, status: 'pending', date: '2025-10-05' },
    { id: '3', user: 'Mike Johnson', type: 'Cable TV', amount: 3500, status: 'approved', date: '2025-10-04' },
  ]);

  const handleApprove = async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Log the admin action
    await logAdminAction({
      action: 'transaction_approved',
      resource_type: 'transaction',
      resource_id: id,
      details: `Approved ${transaction.type} transaction of ₦${transaction.amount} for ${transaction.user}`,
      before_value: { status: 'pending', ...transaction },
      after_value: { status: 'approved', ...transaction }
    });

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    
    toast({
      title: 'Transaction Approved',
      description: `Transaction #${id} has been approved successfully.`
    });
  };

  const handleDecline = async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Log the admin action
    await logAdminAction({
      action: 'transaction_declined',
      resource_type: 'transaction',
      resource_id: id,
      details: `Declined ${transaction.type} transaction of ₦${transaction.amount} for ${transaction.user}`,
      before_value: { status: 'pending', ...transaction },
      after_value: { status: 'declined', ...transaction }
    });

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'declined' } : t));
    
    toast({
      title: 'Transaction Declined',
      description: `Transaction #${id} has been declined.`,
      variant: 'destructive'
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction Management</h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{transaction.type}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">₦{transaction.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'declined' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {transaction.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(transaction.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(transaction.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTab;
