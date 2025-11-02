import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Receipt, Download } from 'lucide-react';
import ReceiptModal from './receipts/ReceiptModal';
import { TransactionExportModal } from './wallet/TransactionExportModal';


const TransactionList: React.FC = () => {
  const { transactions } = useApp();
  const { user } = useAuth();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showExport, setShowExport] = useState(false);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReceipt = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
          {transactions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExport(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>

        
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₦{transaction.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewReceipt(transaction)}
                  >
                    <Receipt className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={selectedTransaction}
      />

      {user && (
        <TransactionExportModal
          open={showExport}
          onOpenChange={setShowExport}
          userId={user.id}
        />
      )}
    </>

  );
};

export default TransactionList;

