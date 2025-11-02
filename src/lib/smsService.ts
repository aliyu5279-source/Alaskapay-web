import { supabase } from './supabase';

export async function sendSMS(phone: string, message: string, templateCode?: string, userId?: string) {
  const { data, error } = await supabase.functions.invoke('send-sms', {
    body: { phone, message, templateCode, userId }
  });
  return { data, error };
}

export async function sendOTP(phone: string, purpose: string = 'verification', userId?: string) {
  const { data, error } = await supabase.functions.invoke('send-otp-sms', {
    body: { phone, purpose, userId }
  });
  return { data, error };
}

export async function sendTransactionAlert(userId: string, phone: string, details: any) {
  const message = `Alaska Pay: ${details.type} of ${details.amount} ${details.currency} ${details.status}. Balance: ${details.balance}. Ref: ${details.reference}`;
  return sendSMS(phone, message, 'transaction_alert', userId);
}
