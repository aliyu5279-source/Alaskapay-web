import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  showCode?: boolean;
}

export function CurrencyDisplay({ amount, currency = 'NGN', className, showCode = true }: CurrencyDisplayProps) {
  const [symbol, setSymbol] = useState('₦');

  useEffect(() => {
    loadSymbol();
  }, [currency]);

  const loadSymbol = async () => {
    const { data } = await supabase
      .from('currencies')
      .select('symbol')
      .eq('code', currency)
      .single();
    
    if (data) setSymbol(data.symbol);
  };

  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <span className={className}>
      {symbol}{formatted} {showCode && currency}
    </span>
  );
}

