-- Wallet Transfer and Withdrawal System Tables

-- Linked Bank Accounts
CREATE TABLE IF NOT EXISTS public.linked_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  recipient_code TEXT, -- Paystack recipient code
  is_primary BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_linked_banks_user ON public.linked_bank_accounts(user_id);

-- Withdrawal Requests
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_account_id UUID NOT NULL,
  bank_account_id UUID REFERENCES public.linked_bank_accounts(id),
  amount DECIMAL(15,2) NOT NULL,
  fee DECIMAL(15,2) DEFAULT 0,
  net_amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  kyc_tier INTEGER DEFAULT 1,
  reference TEXT UNIQUE NOT NULL,
  transfer_code TEXT, -- Paystack transfer code
  processing_time_estimate TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  failure_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_withdrawal_user ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_status ON public.withdrawal_requests(status);

-- Withdrawal Fees Configuration
CREATE TABLE IF NOT EXISTS public.withdrawal_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier INTEGER NOT NULL,
  fee_type TEXT CHECK (fee_type IN ('fixed', 'percentage')),
  fee_value DECIMAL(15,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default withdrawal fees
INSERT INTO public.withdrawal_fees (tier, fee_type, fee_value) VALUES
(1, 'fixed', 50.00),
(2, 'fixed', 25.00),
(3, 'fixed', 10.00)
ON CONFLICT DO NOTHING;

-- Function: Transfer between wallets
CREATE OR REPLACE FUNCTION transfer_between_wallets(
  p_sender_id UUID,
  p_recipient_phone TEXT,
  p_amount DECIMAL,
  p_currency TEXT,
  p_description TEXT
)
RETURNS JSON AS $$
DECLARE
  v_sender_wallet_id UUID;
  v_recipient_user_id UUID;
  v_recipient_wallet_id UUID;
  v_sender_balance DECIMAL;
  v_transaction_id UUID;
BEGIN
  -- Get sender wallet
  SELECT id, balance INTO v_sender_wallet_id, v_sender_balance
  FROM public.wallets WHERE user_id = p_sender_id;
  
  IF v_sender_wallet_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Sender wallet not found');
  END IF;
  
  -- Check balance
  IF v_sender_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient balance');
  END IF;
  
  -- Find recipient by phone
  SELECT id INTO v_recipient_user_id FROM auth.users 
  WHERE phone = p_recipient_phone OR raw_user_meta_data->>'phone' = p_recipient_phone;
  
  IF v_recipient_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Recipient not found');
  END IF;
  
  -- Get recipient wallet
  SELECT id INTO v_recipient_wallet_id FROM public.wallets WHERE user_id = v_recipient_user_id;
  
  IF v_recipient_wallet_id IS NULL THEN
    -- Create wallet for recipient
    INSERT INTO public.wallets (user_id, balance, currency) 
    VALUES (v_recipient_user_id, 0, p_currency)
    RETURNING id INTO v_recipient_wallet_id;
  END IF;
  
  -- Deduct from sender
  UPDATE public.wallets SET balance = balance - p_amount WHERE id = v_sender_wallet_id;
  
  -- Add to recipient
  UPDATE public.wallets SET balance = balance + p_amount WHERE id = v_recipient_wallet_id;
  
  -- Create transaction record
  INSERT INTO public.transactions (
    user_id, wallet_id, type, amount, currency, status, description, reference
  ) VALUES (
    p_sender_id, v_sender_wallet_id, 'transfer_out', p_amount, p_currency, 'completed', 
    p_description, 'TRF-' || gen_random_uuid()
  ) RETURNING id INTO v_transaction_id;
  
  -- Create recipient transaction
  INSERT INTO public.transactions (
    user_id, wallet_id, type, amount, currency, status, description, reference
  ) VALUES (
    v_recipient_user_id, v_recipient_wallet_id, 'transfer_in', p_amount, p_currency, 'completed',
    'Received from ' || p_sender_id::text, 'TRF-' || gen_random_uuid()
  );
  
  RETURN json_build_object('success', true, 'transaction_id', v_transaction_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
