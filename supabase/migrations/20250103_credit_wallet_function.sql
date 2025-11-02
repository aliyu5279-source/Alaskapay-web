-- Function to credit wallet (used by Paystack webhook)
CREATE OR REPLACE FUNCTION credit_wallet(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- Get or create wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = p_user_id;
  
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id, balance, currency) 
    VALUES (p_user_id, p_amount, 'NGN') 
    RETURNING id INTO v_wallet_id;
  ELSE
    UPDATE public.wallets 
    SET balance = balance + p_amount 
    WHERE id = v_wallet_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
