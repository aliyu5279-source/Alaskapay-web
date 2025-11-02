import { supabase } from '@/lib/supabase';
import { resolveAccount } from './paystackService';

export interface LinkedBankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  is_verified: boolean;
  is_primary: boolean;
  created_at: string;
}

export const verifyBankAccount = async (accountNumber: string, bankCode: string) => {
  try {
    const result = await resolveAccount(accountNumber, bankCode);
    if (result.status && result.data) {
      return {
        success: true,
        accountName: result.data.account_name,
        accountNumber: result.data.account_number
      };
    }
    return { success: false, error: result.message || 'Verification failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const linkBankAccount = async (params: {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isPrimary?: boolean;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('linked_bank_accounts')
    .insert({
      user_id: user.id,
      ...params,
      is_verified: true,
      is_primary: params.isPrimary || false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getLinkedBankAccounts = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('linked_bank_accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('is_primary', { ascending: false });

  return data || [];
};
