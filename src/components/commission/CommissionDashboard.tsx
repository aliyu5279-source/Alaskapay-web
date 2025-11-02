import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { CommissionTransactionList } from './CommissionTransactionList';
import { RequestPayoutModal } from './RequestPayoutModal';

export function CommissionDashboard() {
  const [balance, setBalance] = useState<any>(null);
  const [stats, setStats] = useState({ thisMonth: 0, lastMonth: 0, growth: 0 });
  const [showPayout, setShowPayout] = useState(false);

  useEffect(() => {
    loadBalance();
    loadStats();
  }, []);

  const loadBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('commission_balances')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setBalance(data);
  };

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const { data: thisMonthData } = await supabase
      .from('commission_transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('transaction_type', 'credit')
      .gte('created_at', thisMonth.toISOString());

    const { data: lastMonthData } = await supabase
      .from('commission_transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('transaction_type', 'credit')
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', thisMonth.toISOString());

    const thisTotal = thisMonthData?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
    const lastTotal = lastMonthData?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
    const growth = lastTotal > 0 ? ((thisTotal - lastTotal) / lastTotal) * 100 : 0;

    setStats({ thisMonth: thisTotal, lastMonth: lastTotal, growth });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{balance?.available_balance?.toLocaleString() || '0.00'}</div>
            <Button onClick={() => setShowPayout(true)} className="mt-2 w-full" size="sm">
              Request Payout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.thisMonth.toLocaleString()}</div>
            <Badge variant={stats.growth >= 0 ? 'default' : 'destructive'} className="mt-2">
              {stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{balance?.lifetime_earnings?.toLocaleString() || '0.00'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{balance?.total_withdrawn?.toLocaleString() || '0.00'}</div>
          </CardContent>
        </Card>
      </div>

      <CommissionTransactionList />
      {showPayout && <RequestPayoutModal onClose={() => setShowPayout(false)} onSuccess={loadBalance} />}
    </div>
  );
}