import { supabase } from './supabase';

export interface EmailData {
  resetLink?: string;
  amount?: number;
  recipient?: string;
  reference?: string;
  date?: string;
  receiptLink?: string;
  receiptNumber?: string;
  fee?: number;
  from?: string;
  to?: string;
  downloadLink?: string;
  level?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
}

export type EmailType = 
  | 'password_reset'
  | 'payment_confirmation'
  | 'receipt'
  | 'welcome'
  | 'verification_success';

export async function sendTransactionalEmail(
  to: string,
  emailType: EmailType,
  data: EmailData
) {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-transactional-email', {
      body: { to, emailType, data },
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function getEmailDeliveryStatus(trackingId: string) {
  const { data, error } = await supabase
    .from('email_delivery_tracking')
    .select('*')
    .eq('tracking_id', trackingId)
    .single();

  if (error) throw error;
  return data;
}

export async function getEmailBounces(email?: string) {
  let query = supabase.from('email_bounces').select('*').order('timestamp', { ascending: false });
  
  if (email) {
    query = query.eq('email', email);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function checkEmailBounced(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('email_bounces')
    .select('id')
    .eq('email', email)
    .limit(1);

  return (data?.length ?? 0) > 0;
}
