import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Share2, Users, DollarSign, Gift, TrendingUp, Facebook, Twitter, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export default function ReferralDashboard() {
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<any[]>([]);

  useEffect(() => {
    loadReferralData();
    loadTiers();
  }, []);

  const loadReferralData = async () => {
    try {
      const { data: codeData } = await supabase.functions.invoke('manage-referral-code', {
        body: { action: 'get' }
      });
      
      if (codeData?.code) {
        setReferralCode(codeData.code.code);
      }

      const { data: statsData } = await supabase.functions.invoke('manage-referral-code', {
        body: { action: 'stats' }
      });

      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTiers = async () => {
    const { data } = await supabase
      .from('referral_tiers')
      .select('*')
      .order('min_referrals');
    
    if (data) setTiers(data);
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Copied!', description: 'Referral link copied to clipboard' });
  };

  const shareToSocial = (platform: string) => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    const text = 'Join Alaska Pay and get $5 bonus!';
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
      email: `mailto:?subject=${encodeURIComponent('Join Alaska Pay')}&body=${encodeURIComponent(text + ' ' + link)}`
    };

    window.open(urls[platform], '_blank');
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800'
    };
    return colors[tier] || colors.bronze;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">Earn rewards by inviting friends</p>
        </div>
        <Badge className={getTierColor(stats?.tier || 'bronze')}>
          {stats?.tier?.toUpperCase() || 'BRONZE'} TIER
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.successfulReferrals || 0} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalEarnings?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingRewards || 0} pending rewards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReferrals || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalReferrals > 0 
                ? Math.round((stats.successfulReferrals / stats.totalReferrals) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Conversion rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="share" className="space-y-4">
        <TabsList>
          <TabsTrigger value="share">Share & Earn</TabsTrigger>
          <TabsTrigger value="tiers">Reward Tiers</TabsTrigger>
          <TabsTrigger value="history">Referral History</TabsTrigger>
        </TabsList>

        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>Share this link to earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={`${window.location.origin}/signup?ref=${referralCode}`}
                  readOnly
                  className="font-mono"
                />
                <Button onClick={copyReferralLink} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => shareToSocial('facebook')} variant="outline" className="flex-1">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button onClick={() => shareToSocial('twitter')} variant="outline" className="flex-1">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button onClick={() => shareToSocial('email')} variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <Card key={tier.id} className={stats?.tier === tier.tier_name ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {tier.tier_name.toUpperCase()}
                    {stats?.tier === tier.tier_name && <Badge>Current</Badge>}
                  </CardTitle>
                  <CardDescription>{tier.min_referrals}+ referrals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">You earn</p>
                    <p className="text-2xl font-bold">${tier.referrer_reward}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Friend gets</p>
                    <p className="text-xl font-semibold">${tier.referee_reward}</p>
                  </div>
                  {tier.bonus_percentage > 0 && (
                    <Badge variant="secondary">+{tier.bonus_percentage}% bonus</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.referrals?.length > 0 ? (
                  stats.referrals.map((ref: any) => (
                    <div key={ref.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Referral #{ref.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ref.signup_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        ref.status === 'rewarded' ? 'default' :
                        ref.status === 'completed' ? 'secondary' :
                        'outline'
                      }>
                        {ref.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No referrals yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
