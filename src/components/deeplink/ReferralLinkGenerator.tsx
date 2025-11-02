import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deepLinkService } from '@/services/deepLinkService';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function ReferralLinkGenerator() {
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({ clicks: 0, signups: 0, earnings: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: referralData } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (referralData) {
      setReferralCode(referralData.code);
      const link = deepLinkService.generateLink({
        type: 'referral',
        action: 'apply',
        params: { code: referralData.code }
      });
      setReferralLink(link);

      setStats({
        clicks: referralData.total_clicks || 0,
        signups: referralData.successful_referrals || 0,
        earnings: referralData.total_earned || 0
      });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Copied',
      description: 'Referral link copied to clipboard'
    });
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join AlaskaPay',
          text: `Use my referral code ${referralCode} and get ₦500 bonus!`,
          url: referralLink
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      copyLink();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Your Referral Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.clicks}</p>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.signups}</p>
            <p className="text-xs text-muted-foreground">Sign-ups</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">₦{stats.earnings}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>

        {referralLink && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Your Code: {referralCode}</p>
            <p className="text-xs break-all text-muted-foreground">
              {referralLink}
            </p>
            <div className="flex gap-2">
              <Button onClick={copyLink} variant="outline" size="sm" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={shareLink} size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
