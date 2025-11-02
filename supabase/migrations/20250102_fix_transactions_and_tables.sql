-- Fix Database Structure - Transactions and All Tables
-- Run this migration to create/fix all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  kyc_status TEXT DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
  kyc_tier INTEGER DEFAULT 1 CHECK (kyc_tier BETWEEN 1 AND 3),
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets Table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(15,2) DEFAULT 0.00 CHECK (balance >= 0),
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table (FIXED)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id),
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'transfer', 'withdrawal', 'deposit', 'bill_payment', 'card_funding', 'refund')),
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'processing')),
  description TEXT,
  reference TEXT UNIQUE,
  payment_method TEXT,
  recipient_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank Accounts Table
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  recipient_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_number, bank_code)
);

-- Virtual Cards Table
CREATE TABLE IF NOT EXISTS public.virtual_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  card_number TEXT NOT NULL,
  cvv TEXT NOT NULL,
  expiry_month TEXT NOT NULL,
  expiry_year TEXT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled')),
  card_type TEXT DEFAULT 'virtual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bill Payments Table
CREATE TABLE IF NOT EXISTS public.bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.transactions(id),
  biller_name TEXT NOT NULL,
  biller_code TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions Table
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(15,2) NOT NULL,
  rate DECIMAL(5,4) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'wallet')),
  provider TEXT NOT NULL,
  last4 TEXT,
  brand TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC Verifications Table
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 3),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  document_type TEXT,
  document_number TEXT,
  document_url TEXT,
  selfie_url TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_user_id ON public.virtual_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON public.commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_transaction_id ON public.commissions(transaction_id);

-- Updated At Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RPC Functions for Wallet Operations

-- Top Up Wallet Function
CREATE OR REPLACE FUNCTION top_up_wallet(
  p_user_id UUID,
  p_amount DECIMAL,
  p_payment_method TEXT,
  p_reference TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_wallet_id UUID;
BEGIN
  -- Get or create wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = p_user_id;
  
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (p_user_id, 0, 'NGN')
    RETURNING id INTO v_wallet_id;
  END IF;

  -- Create transaction
  INSERT INTO public.transactions (
    user_id, wallet_id, type, amount, status, description, reference, payment_method
  ) VALUES (
    p_user_id, v_wallet_id, 'deposit', p_amount, 'completed', 
    'Wallet top-up', COALESCE(p_reference, 'TOP-' || gen_random_uuid()::text), p_payment_method
  ) RETURNING id INTO v_transaction_id;

  -- Update wallet balance
  UPDATE public.wallets 
  SET balance = balance + p_amount 
  WHERE id = v_wallet_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Transfer Funds Function
CREATE OR REPLACE FUNCTION transfer_funds(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_amount DECIMAL,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_sender_wallet_id UUID;
  v_recipient_wallet_id UUID;
  v_sender_balance DECIMAL;
BEGIN
  -- Get sender wallet
  SELECT id, balance INTO v_sender_wallet_id, v_sender_balance 
  FROM public.wallets WHERE user_id = p_sender_id;

  IF v_sender_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Sender wallet not found';
  END IF;

  IF v_sender_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Get or create recipient wallet
  SELECT id INTO v_recipient_wallet_id FROM public.wallets WHERE user_id = p_recipient_id;
  
  IF v_recipient_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (p_recipient_id, 0, 'NGN')
    RETURNING id INTO v_recipient_wallet_id;
  END IF;

  -- Create debit transaction
  INSERT INTO public.transactions (
    user_id, wallet_id, type, amount, status, description, recipient_id, reference
  ) VALUES (
    p_sender_id, v_sender_wallet_id, 'transfer', p_amount, 'completed',
    COALESCE(p_description, 'Transfer to user'), p_recipient_id, 'TRF-' || gen_random_uuid()::text
  ) RETURNING id INTO v_transaction_id;

  -- Create credit transaction for recipient
  INSERT INTO public.transactions (
    user_id, wallet_id, type, amount, status, description, reference
  ) VALUES (
    p_recipient_id, v_recipient_wallet_id, 'credit', p_amount, 'completed',
    'Transfer from user', 'TRF-' || gen_random_uuid()::text
  );

  -- Update balances
  UPDATE public.wallets SET balance = balance - p_amount WHERE id = v_sender_wallet_id;
  UPDATE public.wallets SET balance = balance + p_amount WHERE id = v_recipient_wallet_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Request Withdrawal Function
CREATE OR REPLACE FUNCTION request_withdrawal(
  p_user_id UUID,
  p_amount DECIMAL,
  p_bank_account_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_wallet_id UUID;
  v_balance DECIMAL;
BEGIN
  -- Get wallet
  SELECT id, balance INTO v_wallet_id, v_balance 
  FROM public.wallets WHERE user_id = p_user_id;

  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Create withdrawal transaction
  INSERT INTO public.transactions (
    user_id, wallet_id, type, amount, status, description, reference
  ) VALUES (
    p_user_id, v_wallet_id, 'withdrawal', p_amount, 'pending',
    'Withdrawal to bank account', 'WTH-' || gen_random_uuid()::text
  ) RETURNING id INTO v_transaction_id;

  -- Deduct from wallet
  UPDATE public.wallets SET balance = balance - p_amount WHERE id = v_wallet_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own bank accounts" ON public.bank_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bank accounts" ON public.bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own virtual cards" ON public.virtual_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own bill payments" ON public.bill_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own commissions" ON public.commissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payment methods" ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own KYC" ON public.kyc_verifications FOR SELECT USING (auth.uid() = user_id);
