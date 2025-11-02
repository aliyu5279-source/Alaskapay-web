import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function ThreeDSAnalyticsTab() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentAuths, setRecentAuths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load today's metrics
      const today = new Date().toISOString().split('T')[0];
      const { data: metricsData } = await supabase
        .from('three_ds_metrics')
        .select('*')
        .eq('date', today)
        .single();

      // Load recent authentications
      const { data: authsData } = await supabase
        .from('three_ds_authentications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setMetrics(metricsData || getDefaultMetrics());
      setRecentAuths(authsData || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setMetrics(getDefaultMetrics());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultMetrics = () => ({
    total_attempts: 0,
    successful_authentications: 0,
    failed_authentications: 0,
    abandoned_authentications: 0,
    success_rate: 0,
    avg_completion_time_seconds: 0,
    liability_shifts_granted: 0,
    chargebacks_prevented_estimate: 0,
    estimated_savings: 0
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-500',
      failed: 'bg-red-500',
      pending: 'bg-yellow-500',
      abandoned: 'bg-gray-500',
      authenticating: 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">3D Secure Analytics</h2>
        <p className="text-muted-foreground">
          Monitor authentication performance and chargeback prevention
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_attempts}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.successful_authentications} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.success_rate?.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Target: 95%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(metrics.avg_completion_time_seconds)}s
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 60s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liability Shifts</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.liability_shifts_granted}</div>
            <p className="text-xs text-muted-foreground">
              Protected transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chargeback Prevention Impact</CardTitle>
            <CardDescription>Estimated savings from 3DS implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Chargebacks Prevented</span>
              <span className="text-2xl font-bold text-green-600">
                {metrics.chargebacks_prevented_estimate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated Savings</span>
              <span className="text-2xl font-bold text-green-600">
                ₦{metrics.estimated_savings?.toLocaleString()}
              </span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Based on average chargeback cost of ₦5,000 per transaction
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Methods</CardTitle>
            <CardDescription>Distribution of verification methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">OTP</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(metrics.otp_count / metrics.total_attempts) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{metrics.otp_count}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Biometric</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(metrics.biometric_count / metrics.total_attempts) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{metrics.biometric_count}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Frictionless</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(metrics.frictionless_count / metrics.total_attempts) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{metrics.frictionless_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Authentications</CardTitle>
          <CardDescription>Latest 3DS authentication attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAuths.map((auth) => (
              <div key={auth.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(auth.status)}`} />
                  <div>
                    <p className="text-sm font-medium">
                      ₦{auth.amount?.toLocaleString()} • {auth.reference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(auth.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRiskColor(auth.risk_level)}>
                    {auth.risk_level}
                  </Badge>
                  <Badge variant={auth.status === 'success' ? 'default' : 'secondary'}>
                    {auth.status}
                  </Badge>
                  {auth.liability_shift && (
                    <Shield className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
            {recentAuths.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No authentication attempts yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}