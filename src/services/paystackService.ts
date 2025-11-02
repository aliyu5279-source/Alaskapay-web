import { supabase } from '@/lib/supabase';
import { config } from '@/config/environment';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const getSecretKey = () => config.paystack.secretKey || import.meta.env.VITE_PAYSTACK_SECRET_KEY || '';
const getPublicKey = () => config.paystack.publicKey || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export interface PaystackResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}


export const initializePayment = async (params: {
  email: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
  channels?: string[];
}) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...params,
      amount: params.amount * 100,
      callback_url: `${window.location.origin}/payment/callback`
    })
  });
  return response.json() as Promise<PaystackResponse>;
};

export const verifyTransaction = async (reference: string) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: { 'Authorization': `Bearer ${getSecretKey()}` }
  });
  return response.json() as Promise<PaystackResponse>;
};

export const listBanks = async (country = 'nigeria') => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/bank?country=${country}`, {
    headers: { 'Authorization': `Bearer ${getSecretKey()}` }
  });
  return response.json() as Promise<PaystackResponse>;
};

export const resolveAccount = async (accountNumber: string, bankCode: string) => {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    { headers: { 'Authorization': `Bearer ${getSecretKey()}` } }
  );
  return response.json() as Promise<PaystackResponse>;
};

export const createRecipient = async (params: {
  type: string;
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transferrecipient`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...params, currency: params.currency || 'NGN' })
  });
  return response.json() as Promise<PaystackResponse>;
};

export const initiateTransfer = async (params: {
  source: string;
  amount: number;
  recipient: string;
  reason?: string;
}) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transfer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...params, amount: params.amount * 100 })
  });
  return response.json() as Promise<PaystackResponse>;
};

export default {
  initializePayment,
  verifyTransaction,
  listBanks,
  resolveAccount,
  createRecipient,
  initiateTransfer
};
