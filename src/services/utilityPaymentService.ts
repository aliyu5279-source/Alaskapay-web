import { supabase } from '@/lib/supabase';

export interface BillProvider {
  id: string;
  name: string;
  category: string;
  countryCode: string;
  logoUrl?: string;
}

export interface CustomerValidation {
  valid: boolean;
  customerName?: string;
  customerNumber: string;
  amount?: number;
  dueDate?: string;
}

export interface BillPaymentResult {
  success: boolean;
  transactionId: string;
  reference: string;
  amount: number;
  customerName?: string;
  message?: string;
}

export const utilityPaymentService = {
  async getBillers(category: string): Promise<BillProvider[]> {
    const { data, error } = await supabase.functions.invoke('reloadly-utility-payment', {
      body: { action: 'getBillers', category }
    });

    if (error) throw error;
    return data.billers || [];
  },

  async validateCustomer(provider: string, customerNumber: string): Promise<CustomerValidation> {
    const { data, error } = await supabase.functions.invoke('reloadly-utility-payment', {
      body: { action: 'validateCustomer', provider, customerNumber }
    });

    if (error) throw error;
    return data;
  },

  async payBill(params: {
    category: string;
    provider: string;
    customerNumber: string;
    customerName?: string;
    amount: number;
    pin: string;
  }): Promise<BillPaymentResult> {
    const reference = `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Verify PIN
    const { data: pinData, error: pinError } = await supabase.functions.invoke('verify-transaction-pin', {
      body: { pin: params.pin }
    });

    if (pinError || !pinData?.valid) {
      throw new Error('Invalid transaction PIN');
    }

    // Process payment
    const { data, error } = await supabase.functions.invoke('reloadly-utility-payment', {
      body: {
        action: 'payBill',
        provider: params.provider,
        customerNumber: params.customerNumber,
        amount: params.amount,
        reference
      }
    });

    if (error) throw error;

    // Save transaction
    const { data: user } = await supabase.auth.getUser();
    await supabase.from('bills_transactions').insert({
      user_id: user.user?.id,
      transaction_id: reference,
      category: params.category,
      provider: params.provider,
      customer_number: params.customerNumber,
      customer_name: params.customerName,
      amount: params.amount,
      fee: 0,
      total_amount: params.amount,
      status: 'successful',
      reference,
      reloadly_transaction_id: data.transactionId
    });

    return {
      success: true,
      transactionId: data.transactionId,
      reference,
      amount: params.amount,
      customerName: params.customerName
    };
  }
};
