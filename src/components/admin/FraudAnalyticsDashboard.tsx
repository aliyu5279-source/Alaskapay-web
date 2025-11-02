import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export function FraudAnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalFlags: 0,
    pendingReview: 0,
    approvedToday: 0,
    avgRiskScore: 0,
    flagsByType: {} as Record<string, number>
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: flags } = await supabase
        .from('transaction_fraud_flags')
        .select('*');

      if (flags) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const pending = flags.filter(f => f.status === 'pending').length;
        const approvedToday = flags.filter(f => 
          f.status === 'approved' && new Date(f.reviewed_at) >= today
        ).length;
        const avgScore = flags.reduce((sum, f) => sum + f.risk_score, 0) / flags.length || 0;

        setStats({
          totalFlags: flags.length,
          pendingReview: pending,
          approvedToday,
          avgRiskScore: Math.round(avgScore),
          flagsByType: {}
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Flags</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFlags}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingReview}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approvedToday}</div>
          <p className="text-xs text-muted-foreground">Reviewed transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgRiskScore}</div>
          <p className="text-xs text-muted-foreground">Out of 100</p>
        </CardContent>
      </Card>
    </div>
  );
}
