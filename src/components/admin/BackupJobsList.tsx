import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, CheckCircle, XCircle, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { CreateBackupModal } from './CreateBackupModal';
import { VerifyBackupModal } from './VerifyBackupModal';

interface BackupJobsListProps {
  onUpdate?: () => void;
}

export function BackupJobsList({ onUpdate }: BackupJobsListProps) {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setBackups(data || []);
    } catch (error: any) {
      toast({ title: 'Error loading backups', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (type: string) => {
    try {
      const { data, error } = await supabase.rpc('create_backup_job', {
        p_backup_type: type,
        p_triggered_by: 'manual'
      });
      
      if (error) throw error;
      toast({ title: 'Backup created', description: 'Backup job has been initiated' });
      loadBackups();
      onUpdate?.();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleVerify = async (backupId: string) => {
    try {
      const { error } = await supabase.rpc('verify_backup', {
        p_backup_id: backupId,
        p_verification_type: 'checksum'
      });
      
      if (error) throw error;
      toast({ title: 'Verification started', description: 'Backup verification in progress' });
      loadBackups();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      completed: 'default',
      verified: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Backup Jobs</CardTitle>
            <Button onClick={() => setShowCreate(true)}>
              <Play className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Retention Until</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">{backup.backup_type}</TableCell>
                  <TableCell>{getStatusBadge(backup.status)}</TableCell>
                  <TableCell>{new Date(backup.started_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {backup.backup_size_bytes 
                      ? `${(backup.backup_size_bytes / 1024 / 1024).toFixed(2)} MB`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {backup.retention_until 
                      ? new Date(backup.retention_until).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {backup.status === 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => handleVerify(backup.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSelectedBackup(backup)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showCreate && (
        <CreateBackupModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateBackup}
        />
      )}

      {selectedBackup && (
        <VerifyBackupModal
          backup={selectedBackup}
          onClose={() => setSelectedBackup(null)}
        />
      )}
    </>
  );
}
