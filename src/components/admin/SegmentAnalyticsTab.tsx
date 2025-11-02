import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Download, TrendingUp, Users, Mail, MousePointer, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function SegmentAnalyticsTab() {
  const [segments, setSegments] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSegments();
  }, []);

  useEffect(() => {
    if (selectedSegment) {
      loadAnalytics();
    }
  }, [selectedSegment, timeRange]);

  const loadSegments = async () => {
    const { data, error } = await supabase
      .from('user_segments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSegments(data);
      if (data.length > 0 && !selectedSegment) {
        setSelectedSegment(data[0].id);
      }
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-segment-analytics', {
        body: { segmentId: selectedSegment, timeRange }
      });

      if (error) throw error;
      setAnalytics(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSegment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-segment-users', {
        body: { segmentId: selectedSegment }
      });

      if (error) throw error;

      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `segment-export-${Date.now()}.csv`;
      a.click();

      toast({
        title: 'Success',
        description: 'Segment exported successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const currentSegment = segments.find(s => s.id === selectedSegment);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Segment Analytics</h2>
          <p className="text-muted-foreground">Analyze segment performance and growth</p>
        </div>
        <Button onClick={exportSegment} disabled={!selectedSegment}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={selectedSegment} onValueChange={setSelectedSegment}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select segment" />
          </SelectTrigger>
          <SelectContent>
            {segments.map(segment => (
              <SelectItem key={segment.id} value={segment.id}>
                {segment.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading analytics...</div>
      ) : analytics ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentSegment?.last_user_count || 0}</div>
                <p className="text-xs text-muted-foreground">Active users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.engagement.openRate}%</div>
                <p className="text-xs text-muted-foreground">Email engagement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.engagement.clickRate}%</div>
                <p className="text-xs text-muted-foreground">Link clicks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.engagement.totalSent}</div>
                <p className="text-xs text-muted-foreground">Emails delivered</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Segment Growth Over Time</CardTitle>
              <CardDescription>Track how segment membership changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.growthData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip labelFormatter={(val) => new Date(val).toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="user_count" stroke="#8884d8" name="Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Segments</CardTitle>
                <CardDescription>Top performing segments by usage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topSegments || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="last_user_count" fill="#8884d8" name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Email campaign results for this segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Opened', value: analytics.engagement.totalOpened },
                        { name: 'Clicked', value: analytics.engagement.totalClicked },
                        { name: 'Unopened', value: analytics.engagement.totalSent - analytics.engagement.totalOpened }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {analytics.abTests && analytics.abTests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>A/B Test Results</CardTitle>
                <CardDescription>Completed tests for this segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.abTests.map((test: any) => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{test.name}</h4>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {test.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Variant A</p>
                          <p className="text-2xl font-bold">{test.variant_a_opens || 0}</p>
                          <p className="text-xs text-muted-foreground">Opens</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Variant B</p>
                          <p className="text-2xl font-bold">{test.variant_b_opens || 0}</p>
                          <p className="text-xs text-muted-foreground">Opens</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Select a segment to view analytics
        </div>
      )}
    </div>
  );
}