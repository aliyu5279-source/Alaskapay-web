import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, DollarSign, Users, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SubscriptionAnalyticsDashboard from './SubscriptionAnalyticsDashboard';

export default function SubscriptionManagementTab() {

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    past_due: 0,
    mrr: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, []);

  const fetchSubscriptions = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*), profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setSubscriptions(data);
  };

  const fetchStats = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('status, subscription_plans(price)');

    if (data) {
      const active = data.filter(s => s.status === 'active');
      setStats({
        total: data.length,
        active: active.length,
        paused: data.filter(s => s.status === 'paused').length,
        past_due: data.filter(s => s.status === 'past_due').length,
        mrr: active.reduce((sum, s) => sum + (s.subscription_plans?.price || 0), 0)
      });
    }
  };

  const filtered = subscriptions.filter(sub =>
    sub.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subscription_plans?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-500',
      paused: 'bg-yellow-500',
      past_due: 'bg-red-500',
      canceled: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-2" />Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">MRR</p>
                <p className="text-2xl font-bold">₦{stats.mrr.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Past Due</p>
                <p className="text-2xl font-bold">{stats.past_due}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by email or plan..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.profiles?.full_name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{sub.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{sub.subscription_plans?.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
                  </TableCell>
                  <TableCell>₦{sub.subscription_plans?.price.toLocaleString()}</TableCell>
                  <TableCell>
                    {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <SubscriptionAnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
}
