import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function RestoreOperations() {
  const [restores, setRestores] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadRestores();
    loadBackups();
  }, []);

  const loadRestores = async () => {
    try {
      const { data, error } = await supabase
        .from('restore_operations')
        .select('*, backup_jobs(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRestores(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const loadBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_jobs')
        .select('*')
        .eq('status', 'verified')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBackups(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const initiateRestore = async (backupId: string) => {
    try {
      const { error } = await supabase.rpc('initiate_restore', {
        p_backup_id: backupId,
        p_restore_type: 'full',
        p_initiated_by: user?.id
      });
      
      if (error) throw error;
      toast({ title: 'Restore initiated', description: 'Restore operation has been started' });
      loadRestores();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Available Backups for Restore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Backup Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>{new Date(backup.created_at).toLocaleString()}</TableCell>
                  <TableCell>{backup.backup_type}</TableCell>
                  <TableCell>
                    {(backup.backup_size_bytes / 1024 / 1024).toFixed(2)} MB
                  </TableCell>
                  <TableCell>
                    <Badge>{backup.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => initiateRestore(backup.id)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restore History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Started</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records Restored</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restores.map((restore) => (
                <TableRow key={restore.id}>
                  <TableCell>{new Date(restore.started_at).toLocaleString()}</TableCell>
                  <TableCell>{restore.restore_type}</TableCell>
                  <TableCell>
                    <Badge variant={restore.status === 'completed' ? 'default' : 'secondary'}>
                      {restore.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{restore.records_restored || '-'}</TableCell>
                  <TableCell>
                    {restore.completed_at 
                      ? new Date(restore.completed_at).toLocaleString()
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
