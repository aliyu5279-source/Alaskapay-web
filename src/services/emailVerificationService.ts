import { supabase } from '@/lib/supabase';

export interface VerificationEmailData {
  verificationLink: string;
  userName?: string;
}

/**
 * Send email verification email to user
 */
export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
  userName?: string
) {
  try {
    const { data, error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        to: email,
        emailType: 'email_verification',
        data: {
          verificationLink,
          userName: userName || email.split('@')[0],
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

/**
 * Verify email with token
 */
export async function verifyEmailToken(token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to verify email:', error);
    throw error;
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to resend verification email:', error);
    throw error;
  }
}
