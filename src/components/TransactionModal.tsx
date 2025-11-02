import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';
import { supabase } from '@/lib/supabase';
import { LimitWarningModal } from './LimitWarningModal';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceName: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, serviceType, serviceName }) => {
  const { user, addTransaction, addNotification } = useApp();
  const { user: authUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [limitCheckData, setLimitCheckData] = useState<any>(null);


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check transaction limit first
    const { data: limitCheck } = await supabase.functions.invoke('check-transaction-limit', {
      body: { amount: parseFloat(amount), userId: authUser?.id }
    });

    if (limitCheck) {
      setLimitCheckData(limitCheck);
      
      // If limit exceeded, show warning and block
      if (!limitCheck.canProceed) {
        setShowLimitWarning(true);
        return;
      }
      
      // If near limit (>80%), show warning but allow proceeding
      if (limitCheck.percentUsed > 80) {
        setShowLimitWarning(true);
        return;
      }
    }

    // Proceed with transaction
    await processTransaction();
  };

  const processTransaction = async () => {
    setLoading(true);

    setTimeout(async () => {
      const transaction: Transaction = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        type: serviceType,
        amount: parseFloat(amount),
        status: 'completed',
        description: `${serviceName} - ${phone}`,
        createdAt: new Date().toISOString()
      };

      addTransaction(transaction);
      
      // Record transaction usage
      await supabase.functions.invoke('record-transaction-usage', {
        body: { amount: parseFloat(amount), userId: authUser?.id }
      });

      addNotification({
        id: Date.now().toString(),
        title: 'Transaction Completed',
        message: `Your ${serviceName} transaction is complete`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString()
      });

      if (authUser?.email) {
        await supabase.functions.invoke('send-transaction-receipt', {
          body: {
            email: authUser.email,
            transactionId: transaction.id,
            amount: amount,
            type: serviceName,
            date: new Date().toLocaleString()
          }
        });
      }

      setLoading(false);
      onClose();
      setAmount('');
      setPhone('');
    }, 1500);
  };


  return (
    <>
      <LimitWarningModal
        open={showLimitWarning}
        onClose={() => setShowLimitWarning(false)}
        onUpgrade={() => {
          setShowLimitWarning(false);
          onClose();
          window.location.href = '/dashboard';
        }}
        onProceed={limitCheckData?.canProceed ? async () => {
          setShowLimitWarning(false);
          await processTransaction();
        } : undefined}
        kycLevel={limitCheckData?.kycLevel || 'none'}
        dailyLimit={limitCheckData?.dailyLimit || 50000}
        currentUsage={limitCheckData?.currentUsage || 0}
        requestedAmount={parseFloat(amount) || 0}
        canProceed={limitCheckData?.canProceed || false}

      />
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{serviceName}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="080XXXXXXXX" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="1000" required min="1" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all disabled:opacity-50">
              {loading ? 'Processing...' : 'Submit Transaction'}
            </button>
          </form>
        </div>
      </div>
    </>
  );

};

export default TransactionModal;