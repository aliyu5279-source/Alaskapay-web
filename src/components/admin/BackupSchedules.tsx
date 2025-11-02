import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function BackupSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_schedules')
        .select('*, backup_retention_policies(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleSchedule = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('backup_schedules')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Schedule updated' });
      loadSchedules();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Backup Schedules</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{schedule.schedule_name}</TableCell>
                <TableCell>{schedule.backup_type}</TableCell>
                <TableCell className="font-mono text-sm">{schedule.cron_expression}</TableCell>
                <TableCell>
                  {schedule.last_run_at 
                    ? new Date(schedule.last_run_at).toLocaleString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  {schedule.next_run_at 
                    ? new Date(schedule.next_run_at).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                    {schedule.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={schedule.is_active}
                    onCheckedChange={() => toggleSchedule(schedule.id, schedule.is_active)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
