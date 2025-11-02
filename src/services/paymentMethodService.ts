import { supabase } from '@/lib/supabase';

export interface PaymentMethodData {
  authorization_code: string;
  card_type: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  bin: string;
  bank: string;
  channel: string;
  signature: string;
  reusable: boolean;
  country_code: string;
}

export async function savePaymentMethod(
  userId: string,
  authData: PaymentMethodData
) {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: userId,
      authorization_code: authData.authorization_code,
      card_type: authData.card_type,
      last4: authData.last4,
      exp_month: authData.exp_month,
      exp_year: authData.exp_year,
      bin: authData.bin,
      bank: authData.bank,
      is_default: false,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserPaymentMethods(userId: string) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function setDefaultPaymentMethod(userId: string, methodId: string) {
  await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);

  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', methodId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deletePaymentMethod(userId: string, methodId: string) {
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_active: false })
    .eq('id', methodId)
    .eq('user_id', userId);

  if (error) throw error;
}
