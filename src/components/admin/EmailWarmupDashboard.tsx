import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { TrendingUp, AlertTriangle, CheckCircle, Pause, Play, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmailWarmupDashboard({ domainId }: { domainId: string }) {
  const [schedule, setSchedule] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWarmupData();
  }, [domainId]);

  const loadWarmupData = async () => {
    const { data: scheduleData } = await supabase
      .from('email_warmup_schedules')
      .select('*')
      .eq('domain_id', domainId)
      .single();

    if (scheduleData) {
      setSchedule(scheduleData);

      const { data: statsData } = await supabase
        .from('email_warmup_daily_stats')
        .select('*')
        .eq('schedule_id', scheduleData.id)
        .order('date', { ascending: true });

      const { data: milestonesData } = await supabase
        .from('email_warmup_milestones')
        .select('*')
        .eq('schedule_id', scheduleData.id)
        .order('achieved_at', { ascending: false })
        .limit(5);

      setStats(statsData || []);
      setMilestones(milestonesData || []);
    }
    setLoading(false);
  };

  const togglePause = async () => {
    const newStatus = schedule.status === 'active' ? 'paused' : 'active';
    await supabase
      .from('email_warmup_schedules')
      .update({ status: newStatus })
      .eq('id', schedule.id);
    loadWarmupData();
  };

  const progressPercentage = schedule 
    ? Math.min((schedule.daily_limit / schedule.target_daily_limit) * 100, 100)
    : 0;

  const chartData = stats.map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sent: s.emails_sent,
    limit: s.daily_limit,
    bounceRate: s.bounce_rate,
  }));

  if (loading) return <div>Loading warmup data...</div>;
  if (!schedule) return <div>No warmup schedule found</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Daily Limit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedule.daily_limit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Target: {schedule.target_daily_limit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warmup Day</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedule.current_day}</div>
            <p className="text-xs text-muted-foreground">
              Next increase in {schedule.increase_interval_days - (schedule.current_day % schedule.increase_interval_days)} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
              {schedule.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Started {new Date(schedule.start_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sending Volume Trend</CardTitle>
          <CardDescription>Daily emails sent vs. warmup limits</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sent" stroke="#8884d8" name="Emails Sent" />
              <Line type="monotone" dataKey="limit" stroke="#82ca9d" name="Daily Limit" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{milestone.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(milestone.achieved_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warmup Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={togglePause} className="w-full">
              {schedule.status === 'active' ? (
                <><Pause className="mr-2 h-4 w-4" /> Pause Warmup</>
              ) : (
                <><Play className="mr-2 h-4 w-4" /> Resume Warmup</>
              )}
            </Button>
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configure Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
