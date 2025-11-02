import { supabase } from '../lib/supabase';

export interface WalletBalance {
  balance: number;
  currency: string;
  user_id: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at?: string;
}

export class WalletService {
  static async getBalance(userId: string): Promise<WalletBalance> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async topUp(
    userId: string,
    amount: number,
    paymentMethod: string
  ): Promise<Transaction> {
    // Validate amount
    if (amount < 100) {
      throw new Error('Minimum top-up amount is 100');
    }
    if (amount > 1000000) {
      throw new Error('Maximum top-up amount is 1,000,000');
    }

    const { data, error } = await supabase.rpc('top_up_wallet', {
      p_user_id: userId,
      p_amount: amount,
      p_payment_method: paymentMethod,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async transfer(
    senderId: string,
    recipientId: string,
    amount: number,
    description?: string
  ): Promise<Transaction> {
    // Check balance first
    const balance = await this.getBalance(senderId);
    if (balance.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const { data, error } = await supabase.rpc('transfer_funds', {
      p_sender_id: senderId,
      p_recipient_id: recipientId,
      p_amount: amount,
      p_description: description,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async withdraw(
    userId: string,
    amount: number,
    bankAccountId: string
  ): Promise<Transaction> {
    // Validate amount
    if (amount < 1000) {
      throw new Error('Minimum withdrawal amount is 1,000');
    }

    const { data, error } = await supabase.rpc('request_withdrawal', {
      p_user_id: userId,
      p_amount: amount,
      p_bank_account_id: bankAccountId,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getTransactionHistory(
    userId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<Transaction[]> {
    const { page = 1, limit = 10 } = options;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw new Error(error.message);
    return data || [];
  }
}