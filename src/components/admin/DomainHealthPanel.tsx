import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

export default function DomainHealthPanel({ domainId }: { domainId: string }) {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
  }, [domainId]);

  const loadHealthData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: schedule } = await supabase
      .from('email_warmup_schedules')
      .select('*')
      .eq('domain_id', domainId)
      .single();

    if (schedule) {
      const { data: recentStats } = await supabase
        .from('email_warmup_daily_stats')
        .select('*')
        .eq('schedule_id', schedule.id)
        .gte('date', sevenDaysAgo)
        .lte('date', today);

      const totalSent = recentStats?.reduce((sum, s) => sum + s.emails_sent, 0) || 0;
      const totalBounced = recentStats?.reduce((sum, s) => sum + s.emails_bounced, 0) || 0;
      const totalComplaints = recentStats?.reduce((sum, s) => sum + s.emails_complained, 0) || 0;

      const avgBounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;
      const avgComplaintRate = totalSent > 0 ? (totalComplaints / totalSent) * 100 : 0;

      setHealthData({
        bounceRate: avgBounceRate,
        complaintRate: avgComplaintRate,
        totalSent,
        isThrottled: recentStats?.some(s => s.throttled) || false,
        status: schedule.status,
      });
    }
    setLoading(false);
  };

  if (loading) return <div>Loading health data...</div>;
  if (!healthData) return null;

  const getBounceRateStatus = (rate: number) => {
    if (rate < 2) return { color: 'green', label: 'Excellent', icon: CheckCircle };
    if (rate < 5) return { color: 'yellow', label: 'Good', icon: TrendingUp };
    if (rate < 10) return { color: 'orange', label: 'Warning', icon: AlertTriangle };
    return { color: 'red', label: 'Critical', icon: TrendingDown };
  };

  const getComplaintRateStatus = (rate: number) => {
    if (rate < 0.1) return { color: 'green', label: 'Excellent', icon: CheckCircle };
    if (rate < 0.3) return { color: 'yellow', label: 'Good', icon: TrendingUp };
    if (rate < 0.5) return { color: 'orange', label: 'Warning', icon: AlertTriangle };
    return { color: 'red', label: 'Critical', icon: TrendingDown };
  };

  const bounceStatus = getBounceRateStatus(healthData.bounceRate);
  const complaintStatus = getComplaintRateStatus(healthData.complaintRate);
  const BounceIcon = bounceStatus.icon;
  const ComplaintIcon = complaintStatus.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Health (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthData.isThrottled && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Domain is currently throttled due to high bounce or complaint rates
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bounce Rate</span>
              <Badge variant={bounceStatus.color === 'green' ? 'default' : 'destructive'}>
                {bounceStatus.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <BounceIcon className={`h-5 w-5 text-${bounceStatus.color}-500`} />
              <span className="text-2xl font-bold">{healthData.bounceRate.toFixed(2)}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Target: &lt; 5% for healthy warmup
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Complaint Rate</span>
              <Badge variant={complaintStatus.color === 'green' ? 'default' : 'destructive'}>
                {complaintStatus.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <ComplaintIcon className={`h-5 w-5 text-${complaintStatus.color}-500`} />
              <span className="text-2xl font-bold">{healthData.complaintRate.toFixed(2)}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Target: &lt; 0.3% for healthy warmup
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Emails Sent</span>
            <span className="font-medium">{healthData.totalSent.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
