import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { RewardRulesManager } from './RewardRulesManager';
import { RewardProcessingDashboard } from './RewardProcessingDashboard';

export default function ReferralManagementTab() {

  const [stats, setStats] = useState<any>(null);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: codes } = await supabase.from('referral_codes').select('*').order('total_earnings', { ascending: false }).limit(10);
    const { data: referrals } = await supabase.from('referrals').select('*');
    const { data: rewards } = await supabase.from('referral_rewards').select('*');
    const { data: tierData } = await supabase.from('referral_tiers').select('*').order('min_referrals');

    setTopReferrers(codes || []);
    setTiers(tierData || []);
    
    const totalReferrals = referrals?.length || 0;
    const successfulReferrals = referrals?.filter(r => r.status === 'completed' || r.status === 'rewarded').length || 0;
    const totalRewards = rewards?.reduce((sum, r) => sum + parseFloat(r.amount), 0) || 0;

    setStats({ totalReferrals, successfulReferrals, totalRewards });
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="rules">Reward Rules</TabsTrigger>
        <TabsTrigger value="processing">Automation</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.successfulReferrals || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRewards?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tiers</CardTitle>
              <Award className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tiers.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topReferrers.map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell className="font-mono">{ref.code}</TableCell>
                    <TableCell><Badge>{ref.tier}</Badge></TableCell>
                    <TableCell>{ref.successful_referrals}/{ref.total_referrals}</TableCell>
                    <TableCell>${parseFloat(ref.total_earnings).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rules">
        <RewardRulesManager />
      </TabsContent>

      <TabsContent value="processing">
        <RewardProcessingDashboard />
      </TabsContent>
    </Tabs>
  );
}
