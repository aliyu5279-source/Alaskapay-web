import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, StopCircle, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LoadTestConfig, loadTestingService } from '@/lib/loadTesting';
import { toast } from 'sonner';

export function LoadTestingDashboard() {
  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [activeTest, setActiveTest] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTestRuns();
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTestRuns = async () => {
    const { data } = await supabase
      .from('load_test_runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setTestRuns(data || []);
  };

  const loadMetrics = async () => {
    if (!activeTest) return;
    const { data } = await supabase
      .from('load_test_metrics')
      .select('*')
      .eq('test_run_id', activeTest.id)
      .order('timestamp', { ascending: false })
      .limit(100);
    setMetrics(data);
  };

  const startLoadTest = async (config: LoadTestConfig) => {
    setLoading(true);
    try {
      const testRun = await loadTestingService.createTestRun(config);
      await loadTestingService.startTest(testRun.id);
      setActiveTest(testRun);
      
      // Trigger edge function to run actual load test
      await supabase.functions.invoke('run-load-test', {
        body: { testRunId: testRun.id, config },
      });
      
      toast.success('Load test started');
      loadTestRuns();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const quickTests = [
    { name: 'Wallet Stress Test', type: 'wallet', users: 1000, duration: 600 },
    { name: 'Payment Load Test', type: 'payment', users: 500, duration: 300 },
    { name: 'API Endurance Test', type: 'api', users: 2000, duration: 1800 },
    { name: 'Full System Test', type: 'full', users: 1500, duration: 900 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Load Testing Dashboard</h2>
        <Badge variant={activeTest ? 'default' : 'secondary'}>
          {activeTest ? 'Test Running' : 'Ready'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickTests.map((test) => (
          <Card key={test.name}>
            <CardHeader>
              <CardTitle className="text-sm">{test.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{test.users} virtual users</p>
                <p>{test.duration / 60} minutes</p>
              </div>
              <Button
                className="w-full mt-4"
                size="sm"
                onClick={() => startLoadTest({
                  name: test.name,
                  testType: test.type as any,
                  virtualUsers: test.users,
                  durationSeconds: test.duration,
                })}
                disabled={loading || !!activeTest}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeTest && metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                icon={Activity}
                label="Avg Response Time"
                value={`${calculateAvg(metrics, 'response_time')}ms`}
                trend="+5%"
              />
              <MetricCard
                icon={TrendingUp}
                label="Throughput"
                value={`${calculateThroughput(metrics)}/s`}
                trend="+12%"
              />
              <MetricCard
                icon={AlertTriangle}
                label="Error Rate"
                value={`${calculateErrorRate(metrics)}%`}
                trend="-2%"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend }: any) {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <Icon className="h-8 w-8 text-primary" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-green-600">{trend}</p>
      </div>
    </div>
  );
}

const calculateAvg = (metrics: any[], type: string) => {
  const filtered = metrics.filter(m => m.metric_type === type);
  return filtered.length ? (filtered.reduce((a, b) => a + Number(b.value), 0) / filtered.length).toFixed(0) : 0;
};

const calculateThroughput = (metrics: any[]) => {
  return metrics.filter(m => m.metric_type === 'throughput').length;
};

const calculateErrorRate = (metrics: any[]) => {
  const errors = metrics.filter(m => m.metric_type === 'error_rate');
  return errors.length ? (errors.reduce((a, b) => a + Number(b.value), 0) / errors.length).toFixed(2) : 0;
};
