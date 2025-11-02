import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Utensils, Car, Home, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const SpendingInsights: React.FC = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInsights();
    }
  }, [user]);

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (!error && data) {
        const totalSpent = data.reduce((sum, t) => sum + (t.amount || 0), 0);
        const avgTransaction = totalSpent / (data.length || 1);
        
        setInsights({
          totalSpent,
          avgTransaction,
          transactionCount: data.length,
          topCategory: 'Shopping',
          trend: 'up'
        });
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Shopping', amount: 45000, icon: ShoppingCart, color: 'bg-blue-500' },
    { name: 'Food', amount: 32000, icon: Utensils, color: 'bg-green-500' },
    { name: 'Transport', amount: 18000, icon: Car, color: 'bg-yellow-500' },
    { name: 'Bills', amount: 25000, icon: Zap, color: 'bg-red-500' },
  ];

  if (loading) return <div>Loading insights...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Spent (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{insights?.totalSpent?.toLocaleString() || 0}</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingDown className="w-4 h-4 mr-1" />
              12% less than last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{insights?.avgTransaction?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.transactionCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${cat.color}`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{cat.name}</span>
                    <span className="font-semibold">₦{cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${(cat.amount / 120000) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingInsights;
