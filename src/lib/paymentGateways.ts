import { supabase } from './supabase';

export interface PaymentInitData {
  amount: number;
  email: string;
  userId: string;
  currency?: string;
  name?: string;
}

export interface PaymentResponse {
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}

// Paystack Integration
export const initializePaystackPayment = async (
  data: PaymentInitData
): Promise<PaymentResponse> => {
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100,
        currency: data.currency || 'NGN',
        metadata: {
          userId: data.userId,
          type: 'wallet_topup'
        },
        callback_url: `${window.location.origin}/wallet?payment=success`
      })
    });

    const result = await response.json();

    if (result.status) {
      return {
        success: true,
        authorizationUrl: result.data.authorization_url,
        reference: result.data.reference
      };
    }

    return { success: false, error: result.message };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Flutterwave Integration
export const initializeFlutterwavePayment = async (
  data: PaymentInitData
): Promise<PaymentResponse> => {
  try {
    const txRef = `FLW-${Date.now()}-${data.userId}`;
    
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: data.amount,
        currency: data.currency || 'NGN',
        redirect_url: `${window.location.origin}/wallet?payment=success`,
        customer: {
          email: data.email,
          name: data.name || 'User'
        },
        customizations: {
          title: 'Wallet Top-up',
          description: 'Add funds to your wallet'
        },
        meta: {
          userId: data.userId,
          type: 'wallet_topup'
        }
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      return {
        success: true,
        authorizationUrl: result.data.link,
        reference: txRef
      };
    }

    return { success: false, error: result.message };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Verify payment and update wallet
export const verifyAndCreditWallet = async (
  reference: string,
  provider: 'paystack' | 'flutterwave'
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Record transaction
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: 0, // Will be updated by webhook
      status: 'pending',
      reference,
      provider
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};