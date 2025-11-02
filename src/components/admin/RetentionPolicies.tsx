import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function RetentionPolicies() {
  const [policies, setPolicies] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_retention_policies')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      setPolicies(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const togglePolicy = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('backup_retention_policies')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Policy updated' });
      loadPolicies();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const runCleanup = async () => {
    try {
      const { data, error } = await supabase.rpc('cleanup_old_backups');
      if (error) throw error;
      
      toast({ 
        title: 'Cleanup completed', 
        description: `Deleted ${data[0]?.deleted_count || 0} backups, freed ${((data[0]?.freed_bytes || 0) / 1024 / 1024).toFixed(2)} MB`
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Retention Policies</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={runCleanup}>
              <Trash2 className="mr-2 h-4 w-4" />
              Run Cleanup
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Policy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Name</TableHead>
              <TableHead>Backup Type</TableHead>
              <TableHead>Retention Days</TableHead>
              <TableHead>Max Backups</TableHead>
              <TableHead>Auto Delete</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.policy_name}</TableCell>
                <TableCell>{policy.backup_type}</TableCell>
                <TableCell>{policy.retention_days} days</TableCell>
                <TableCell>{policy.max_backups || 'Unlimited'}</TableCell>
                <TableCell>
                  <Badge variant={policy.auto_delete ? 'default' : 'secondary'}>
                    {policy.auto_delete ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>{policy.priority}</TableCell>
                <TableCell>
                  <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={policy.is_active}
                    onCheckedChange={() => togglePolicy(policy.id, policy.is_active)}
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
