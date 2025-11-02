import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, ArrowDownToLine, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface WalletBalanceCardProps {
  onTopUp: () => void;
  onTransfer: () => void;
  onWithdraw?: () => void;
  onWalletLoad?: (wallet: any) => void;
}


export function WalletBalanceCard({ onTopUp, onTransfer, onWithdraw, onWalletLoad }: WalletBalanceCardProps) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('NGN');
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState('');

  const fetchBalance = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();

      if (data) {
        setBalance(parseFloat(data.available_balance));
        setCurrency(data.currency_code);
        setWalletId(data.id);
        onWalletLoad?.({
          id: data.id,
          balance: parseFloat(data.available_balance),
          currency: data.currency_code
        });
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    const channel = supabase
      .channel('wallet-balance')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wallet_accounts',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchBalance();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-blue-100 text-sm mb-2">Available Balance</p>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">
              {showBalance ? `${currency} ${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '••••••'}
            </h2>
            <button onClick={() => setShowBalance(!showBalance)} className="text-blue-100 hover:text-white">
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchBalance}
          disabled={loading}
          className="text-white hover:bg-white/20"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button onClick={onTopUp} className="bg-white text-blue-600 hover:bg-blue-50">
          <ArrowDownLeft size={18} className="mr-2" />
          Top Up
        </Button>
        <Button onClick={onTransfer} variant="outline" className="border-white text-white hover:bg-white/20">
          <ArrowUpRight size={18} className="mr-2" />
          Transfer
        </Button>
        {onWithdraw && (
          <Button onClick={onWithdraw} variant="outline" className="border-white text-white hover:bg-white/20">
            <ArrowDownToLine size={18} className="mr-2" />
            Withdraw
          </Button>
        )}
      </div>
    </Card>
  );
}

