import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar, Send } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ComplianceChecksTab from './ComplianceChecksTab';
import RegulatoryReportsTab from './RegulatoryReportsTab';
import ComplianceDeadlinesTab from './ComplianceDeadlinesTab';
import { RegulatorySubmissionsTab } from './RegulatorySubmissionsTab';
import { SubmissionQueueManager } from './SubmissionQueueManager';


export default function ComplianceDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [checksRes, alertsRes, deadlinesRes] = await Promise.all([
        supabase.from('compliance_checks').select('status').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('compliance_alerts').select('*').eq('acknowledged', false).order('created_at', { ascending: false }).limit(5),
        supabase.from('compliance_deadlines').select('*').eq('status', 'pending').lte('due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const checks = checksRes.data || [];
      setStats({
        passed: checks.filter(c => c.status === 'passed').length,
        failed: checks.filter(c => c.status === 'failed').length,
        warnings: checks.filter(c => c.status === 'warning').length,
        upcomingDeadlines: deadlinesRes.data?.length || 0
      });

      setAlerts(alertsRes.data || []);
    } catch (error: any) {
      toast({ title: 'Error loading data', description: error.message, variant: 'destructive' });
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await supabase.from('compliance_alerts').update({ acknowledged: true, acknowledged_at: new Date().toISOString() }).eq('id', alertId);
      setAlerts(alerts.filter(a => a.id !== alertId));
      toast({ title: 'Alert acknowledged' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance Management</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          CBN • NDPR • GDPR • PCI-DSS
        </Badge>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Passed Checks</p>
                  <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Checks</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.warnings}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
                  <p className="text-2xl font-bold">{stats.upcomingDeadlines}</p>
                </div>
                <Clock className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Active Compliance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start justify-between bg-white p-4 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>{alert.severity}</Badge>
                    <span className="text-sm text-muted-foreground">{alert.regulation_type}</span>
                  </div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <Button size="sm" onClick={() => acknowledgeAlert(alert.id)}>Acknowledge</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="checks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checks"><Shield className="w-4 h-4 mr-2" />Compliance Checks</TabsTrigger>
          <TabsTrigger value="reports"><FileText className="w-4 h-4 mr-2" />Regulatory Reports</TabsTrigger>
          <TabsTrigger value="deadlines"><Calendar className="w-4 h-4 mr-2" />Deadlines</TabsTrigger>
          <TabsTrigger value="submissions"><Send className="w-4 h-4 mr-2" />Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="checks"><ComplianceChecksTab /></TabsContent>
        <TabsContent value="reports"><RegulatoryReportsTab /></TabsContent>
        <TabsContent value="deadlines"><ComplianceDeadlinesTab /></TabsContent>
        <TabsContent value="submissions">
          <div className="space-y-6">
            <RegulatorySubmissionsTab />
            <SubmissionQueueManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}