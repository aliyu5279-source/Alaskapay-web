import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Transaction, Notification } from '../types';
import { supabase } from '@/lib/supabase';
import { safeInvokeFunction } from '@/lib/errorHandler';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    balance: 25000,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-01'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addTransaction = async (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    
    // Check for large transaction alert (non-blocking)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      
      const { data: prefs } = await supabase.from('notification_preferences').select('large_transactions, large_transaction_threshold').eq('user_id', authUser.id).single();
      
      if (prefs?.large_transactions && transaction.amount >= (prefs.large_transaction_threshold || 1000)) {
        // Use safe invoke to prevent errors from blocking the UI
        await safeInvokeFunction(supabase, 'send-security-alert', {
          userId: authUser.id,
          alertType: 'large_transaction',
          metadata: {
            amount: transaction.amount,
            description: transaction.description,
            recipient: 'N/A',
            transactionId: transaction.id,
            timestamp: transaction.createdAt,
            status: transaction.status
          }
        });
      }
    } catch (error) {
      // Silently fail - don't block transaction
      console.warn('Transaction alert failed:', error);
    }
  };


  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{ user, setUser, transactions, addTransaction, notifications, addNotification, markNotificationRead }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
