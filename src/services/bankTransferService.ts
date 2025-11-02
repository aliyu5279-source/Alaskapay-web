import { supabase } from '@/lib/supabase';

export interface BankTransferRequest {
  userId: string;
  bankAccountId: string;
  amount: number;
  currency?: string;
}

export interface BankTransferResponse {
  success: boolean;
  transaction?: any;
  requiresAuth?: boolean;
  reference?: string;
  message?: string;
  error?: string;
}

export interface OTPSubmission {
  reference: string;
  otp: string;
}

export const bankTransferService = {
  // Initiate bank transfer charge
  async initiateTransfer(request: BankTransferRequest): Promise<BankTransferResponse> {
    try {
      const { data: bankAccount, error: bankError } = await supabase
        .from('linked_bank_accounts')
        .select('*')
        .eq('id', request.bankAccountId)
        .eq('user_id', request.userId)
        .single();

      if (bankError || !bankAccount) {
        throw new Error('Bank account not found');
      }

      // Call Paystack via our backend
      const response = await fetch('/api/paystack/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorization_code: bankAccount.authorization_code,
          email: bankAccount.account_email,
          amount: Math.round(request.amount * 100),
          currency: request.currency || 'NGN',
          metadata: {
            user_id: request.userId,
            bank_account_id: request.bankAccountId,
            purpose: 'wallet_funding'
          }
        })
      });

      const data = await response.json();

      // Create transaction record
      const { data: transaction } = await supabase
        .from('bank_transfers')
        .insert({
          user_id: request.userId,
          bank_account_id: request.bankAccountId,
          amount: request.amount,
          currency: request.currency || 'NGN',
          status: data.status || 'pending',
          reference: data.reference,
          paystack_response: data,
        })
        .select()
        .single();

      return {
        success: true,
        transaction,
        requiresAuth: data.status === 'send_otp' || data.status === 'pending',
        reference: data.reference,
        message: data.display_text || data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Submit OTP for authorization
  async submitOTP(submission: OTPSubmission): Promise<BankTransferResponse> {
    try {
      const response = await fetch('/api/paystack/submit-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      const data = await response.json();

      // Update transaction status
      await supabase
        .from('bank_transfers')
        .update({
          status: data.status,
          paystack_response: data,
          updated_at: new Date().toISOString()
        })
        .eq('reference', submission.reference);

      return {
        success: data.status === 'success',
        message: data.message,
        reference: submission.reference
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Verify transfer status
  async verifyTransfer(reference: string): Promise<BankTransferResponse> {
    try {
      const response = await fetch(`/api/paystack/verify/${reference}`);
      const data = await response.json();

      // Update transaction
      const { data: transaction } = await supabase
        .from('bank_transfers')
        .update({
          status: data.status,
          verified_at: new Date().toISOString()
        })
        .eq('reference', reference)
        .select()
        .single();

      // Credit wallet if successful
      if (data.status === 'success' && transaction) {
        await this.creditWallet(transaction);
      }

      return {
        success: data.status === 'success',
        transaction,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Credit user wallet
  async creditWallet(transaction: any): Promise<void> {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', transaction.user_id)
      .eq('currency', transaction.currency)
      .single();

    if (wallet) {
      await supabase
        .from('wallets')
        .update({
          balance: wallet.balance + transaction.amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', transaction.user_id)
        .eq('currency', transaction.currency);

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: transaction.user_id,
          type: 'deposit',
          amount: transaction.amount,
          currency: transaction.currency,
          status: 'completed',
          description: 'Wallet funding via bank transfer',
          reference: transaction.reference,
          metadata: { bank_transfer_id: transaction.id }
        });
    }
  }
};
