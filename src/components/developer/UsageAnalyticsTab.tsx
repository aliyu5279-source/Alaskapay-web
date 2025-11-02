import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, Zap, AlertCircle } from 'lucide-react';

export function UsageAnalyticsTab() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    errorCount: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const { data: account } = await supabase
      .from('developer_accounts')
      .select('id')
      .single();
    
    if (account) {
      const { data: logs } = await supabase
        .from('api_usage_logs')
        .select('*')
        .eq('developer_account_id', account.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (logs) {
        const total = logs.length;
        const successful = logs.filter(l => l.status_code >= 200 && l.status_code < 300).length;
        const avgTime = logs.reduce((sum, l) => sum + (l.response_time_ms || 0), 0) / total;
        const errors = logs.filter(l => l.status_code >= 400).length;

        setStats({
          totalRequests: total,
          successRate: (successful / total) * 100,
          avgResponseTime: Math.round(avgTime),
          errorCount: errors
        });

        // Group by date for chart
        const grouped = logs.reduce((acc: any, log) => {
          const date = new Date(log.created_at).toLocaleDateString();
          if (!acc[date]) acc[date] = { date, requests: 0, errors: 0 };
          acc[date].requests++;
          if (log.status_code >= 400) acc[date].errors++;
          return acc;
        }, {});

        setChartData(Object.values(grouped));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Usage Analytics</h2>
        <p className="text-gray-600">Monitor your API usage and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Requests (7d)</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold">{stats.errorCount}</div>
          <div className="text-sm text-gray-600">Errors (7d)</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Request Volume (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="requests" fill="#3b82f6" />
            <Bar dataKey="errors" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Top Endpoints</h3>
        <div className="space-y-3">
          {[
            { endpoint: '/api/v1/payments/initiate', calls: 1234, avgTime: 145 },
            { endpoint: '/api/v1/payments/verify', calls: 1189, avgTime: 98 },
            { endpoint: '/api/v1/wallet/balance', calls: 856, avgTime: 67 },
            { endpoint: '/api/v1/transfers/create', calls: 432, avgTime: 234 }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <code className="text-sm font-mono">{item.endpoint}</code>
                <div className="text-xs text-gray-600 mt-1">{item.calls} calls</div>
              </div>
              <div className="text-sm text-gray-600">{item.avgTime}ms avg</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
