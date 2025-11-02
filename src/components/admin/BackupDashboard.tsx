import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Shield, Clock, HardDrive } from 'lucide-react';
import { BackupJobsList } from './BackupJobsList';
import { BackupSchedules } from './BackupSchedules';
import { RestoreOperations } from './RestoreOperations';
import { RetentionPolicies } from './RetentionPolicies';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function BackupDashboard() {
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_backup_statistics');
      if (error) throw error;
      setStats(data);
    } catch (error: any) {
      toast({ title: 'Error loading stats', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_backups || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_backups > 0 
                ? ((stats.completed_backups / stats.total_backups) * 100).toFixed(1) 
                : 0}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats?.total_size_bytes || 0) / 1024 / 1024).toFixed(2)} MB
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {stats?.last_backup_at 
                ? new Date(stats.last_backup_at).toLocaleDateString() 
                : 'Never'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backup Jobs</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="policies">Retention Policies</TabsTrigger>
        </TabsList>
        <TabsContent value="backups">
          <BackupJobsList onUpdate={loadStats} />
        </TabsContent>
        <TabsContent value="schedules">
          <BackupSchedules />
        </TabsContent>
        <TabsContent value="restore">
          <RestoreOperations />
        </TabsContent>
        <TabsContent value="policies">
          <RetentionPolicies />
        </TabsContent>
      </Tabs>
    </div>
  );
}
