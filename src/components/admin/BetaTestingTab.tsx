import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Users, MessageSquare, Bug, TrendingUp, Send, Download } from 'lucide-react';
import { toast } from 'sonner';
import { TesterGroupsManager } from './TesterGroupsManager';
import { FeedbackTrendsAnalytics } from './FeedbackTrendsAnalytics';

export function BetaTestingTab() {
  const [testers, setTesters] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [crashes, setCrashes] = useState<any[]>([]);
  const [builds, setBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBetaData();
  }, []);

  const loadBetaData = async () => {
    try {
      const [testersRes, feedbackRes, crashesRes, buildsRes] = await Promise.all([
        supabase.from('beta_testers').select('*').order('created_at', { ascending: false }),
        supabase.from('beta_feedback').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(50),
        supabase.from('beta_crashes').select('*, beta_builds(version)').order('created_at', { ascending: false }).limit(50),
        supabase.from('beta_builds').select('*').order('created_at', { ascending: false }).limit(20)
      ]);

      if (testersRes.data) setTesters(testersRes.data);
      if (feedbackRes.data) setFeedback(feedbackRes.data);
      if (crashesRes.data) setCrashes(crashesRes.data);
      if (buildsRes.data) setBuilds(buildsRes.data);
    } catch (error) {
      toast.error('Failed to load beta testing data');
    } finally {
      setLoading(false);
    }
  };

  const notifyTesters = async (group: string, message: string) => {
    try {
      const { error } = await supabase.functions.invoke('notify-beta-testers', {
        body: { group, title: 'New Update Available', message }
      });
      if (error) throw error;
      toast.success('Testers notified successfully');
    } catch (error) {
      toast.error('Failed to notify testers');
    }
  };

  const exportFeedback = () => {
    const csv = [
      ['Date', 'User', 'Feedback', 'Version', 'Platform', 'Status'],
      ...feedback.map(f => [
        new Date(f.created_at).toLocaleDateString(),
        f.profiles?.full_name || 'Anonymous',
        f.feedback,
        f.app_version,
        f.platform,
        f.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beta-feedback-${new Date().toISOString()}.csv`;
    a.click();
  };

  const stats = {
    totalTesters: testers.length,
    activeTesters: testers.filter(t => t.status === 'active').length,
    totalFeedback: feedback.length,
    unresolvedFeedback: feedback.filter(f => f.status === 'new').length,
    totalCrashes: crashes.length,
    criticalCrashes: crashes.filter(c => c.is_fatal && !c.resolved).length
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Testers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTesters}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalTesters} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Items</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unresolvedFeedback}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalFeedback} unresolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crash Reports</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticalCrashes}</div>
            <p className="text-xs text-muted-foreground">critical unresolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Build</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{builds[0]?.version || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{builds[0]?.install_count || 0} installs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="testers">Testers</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="crashes">Crashes</TabsTrigger>
          <TabsTrigger value="builds">Builds</TabsTrigger>
        </TabsList>


        <TabsContent value="feedback" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Beta Feedback</h3>
            <Button onClick={exportFeedback} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          <div className="space-y-2">
            {feedback.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm">{item.feedback}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{item.app_version}</Badge>
                        <Badge variant="outline">{item.platform}</Badge>
                        <Badge>{item.status}</Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Beta Testers</h3>
            <Button onClick={() => notifyTesters('beta-users', 'New build available!')} size="sm">
              <Send className="h-4 w-4 mr-2" />
              Notify All
            </Button>
          </div>
          <div className="space-y-2">
            {testers.map((tester) => (
              <Card key={tester.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tester.full_name || tester.email}</p>
                      <p className="text-sm text-muted-foreground">{tester.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={tester.status === 'active' ? 'default' : 'secondary'}>
                        {tester.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tester.feedback_count} feedback
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <TesterGroupsManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <FeedbackTrendsAnalytics />
        </TabsContent>

        <TabsContent value="crashes" className="space-y-4">
          <h3 className="text-lg font-semibold">Crash Reports</h3>

          <div className="space-y-2">
            {crashes.map((crash) => (
              <Card key={crash.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">{crash.crash_message}</p>
                      <Badge variant={crash.is_fatal ? 'destructive' : 'secondary'}>
                        {crash.is_fatal ? 'Fatal' : 'Non-fatal'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Version: {crash.beta_builds?.version} • {crash.platform}
                    </p>
                    {crash.stack_trace && (
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {crash.stack_trace.substring(0, 200)}...
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builds" className="space-y-4">
          <h3 className="text-lg font-semibold">Build History</h3>
          <div className="space-y-2">
            {builds.map((build) => (
              <Card key={build.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">v{build.version} ({build.build_number})</p>
                      <p className="text-sm text-muted-foreground mt-1">{build.release_notes}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge>{build.platform}</Badge>
                        <Badge variant="outline">{build.status}</Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>{build.install_count} installs</p>
                      <p className="text-muted-foreground">{build.crash_count} crashes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
