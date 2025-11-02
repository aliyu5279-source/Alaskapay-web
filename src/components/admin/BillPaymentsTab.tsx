import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export function BillPaymentsTab() {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, flagged: 0, revenue: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [flaggedPayments, setFlaggedPayments] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecentPayments();
    loadFlaggedPayments();
  }, []);

  const loadStats = async () => {
    try {
      const { data: payments } = await supabase
        .from('bill_payments')
        .select('status, total_amount, fraud_check_status');
      
      const total = payments?.length || 0;
      const pending = payments?.filter(p => p.status === 'pending' || p.status === 'processing').length || 0;
      const completed = payments?.filter(p => p.status === 'completed').length || 0;
      const flagged = payments?.filter(p => p.fraud_check_status === 'flagged').length || 0;
      const revenue = payments?.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0) || 0;

      setStats({ total, pending, completed, flagged, revenue });
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const loadRecentPayments = async () => {
    try {
      const { data } = await supabase
        .from('bill_payments')
        .select('*, payee:bill_payees(*)')
        .order('created_at', { ascending: false })
        .limit(10);
      setRecentPayments(data || []);
    } catch (error) {
      console.error('Failed to load payments', error);
    }
  };

  const loadFlaggedPayments = async () => {
    try {
      const { data } = await supabase
        .from('bill_payments')
        .select('*, payee:bill_payees(*)')
        .eq('fraud_check_status', 'flagged')
        .order('created_at', { ascending: false });
      setFlaggedPayments(data || []);
    } catch (error) {
      console.error('Failed to load flagged payments', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      pending: 'outline',
      pending_review: 'destructive',
      failed: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.flagged}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Payments</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({flaggedPayments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {recentPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{payment.payee?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Ref: {payment.confirmation_number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(payment.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="font-bold">${payment.amount}</div>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          {flaggedPayments.map((payment) => (
            <Card key={payment.id} className="border-red-200">
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{payment.payee?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Fraud Score: {payment.fraud_score}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(payment.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="font-bold">${payment.amount}</div>
                    <Badge variant="destructive">Flagged</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}