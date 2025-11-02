import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, AlertCircle, CheckCircle, Clock, Database, RefreshCw, Server } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface HealthCheck {
  service_name: string;
  status: 'healthy' | 'degraded' | 'down';
  response_time_ms: number;
  error_message?: string;
  checked_at: string;
}

export function SystemHealthDashboard() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  const { toast } = useToast();

  const loadHealthData = async () => {
    setLoading(true);
    try {
      // Get latest health checks
      const { data: healthData } = await supabase
        .from('health_check_logs')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(10);

      if (healthData) {
        const latest = healthData.reduce((acc: any, check: any) => {
          if (!acc[check.service_name]) {
            acc[check.service_name] = check;
          }
          return acc;
        }, {});
        setChecks(Object.values(latest));
      }

      // Get system metrics
      const { data: metricsData } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (metricsData) {
        const grouped = metricsData.reduce((acc: any, m: any) => {
          if (!acc[m.metric_name]) acc[m.metric_name] = [];
          acc[m.metric_name].push(m);
          return acc;
        }, {});
        setMetrics(grouped);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const runHealthCheck = async () => {
    try {
      await supabase.functions.invoke('health-check');
      toast({ title: 'Health check completed' });
      setTimeout(loadHealthData, 1000);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadHealthData();
    const interval = setInterval(loadHealthData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Health</h2>
        <Button onClick={runHealthCheck} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Run Check
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {checks.map((check) => (
          <Card key={check.service_name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Server className="h-4 w-4" />
                {check.service_name.replace(/_/g, ' ').toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant={check.status === 'healthy' ? 'default' : 'destructive'}>
                  {check.status === 'healthy' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  {check.status}
                </Badge>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {check.response_time_ms}ms
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
