import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, Trash2, Plus, Play } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduledExport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  export_format: 'csv' | 'json' | 'both';
  include_analytics: boolean;
  recipient_emails: string[];
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string;
  retention_days: number;
}

export function ScheduledExportsManager() {
  const [exports, setExports] = useState<ScheduledExport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily' as const,
    export_format: 'csv' as const,
    include_analytics: true,
    recipient_emails: '',
    retention_days: 30
  });

  useEffect(() => {
    loadExports();
  }, []);

  const loadExports = async () => {
    const { data, error } = await supabase
      .from('scheduled_batch_exports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load scheduled exports');
      return;
    }

    setExports(data || []);
  };

  const handleCreate = async () => {
    const emails = formData.recipient_emails.split(',').map(e => e.trim()).filter(Boolean);
    
    if (!formData.name || emails.length === 0) {
      toast.error('Name and at least one email are required');
      return;
    }

    const nextRun = new Date();
    if (formData.frequency === 'daily') nextRun.setDate(nextRun.getDate() + 1);
    else if (formData.frequency === 'weekly') nextRun.setDate(nextRun.getDate() + 7);
    else nextRun.setMonth(nextRun.getMonth() + 1);

    const { error } = await supabase.from('scheduled_batch_exports').insert({
      ...formData,
      recipient_emails: emails,
      next_run_at: nextRun.toISOString()
    });

    if (error) {
      toast.error('Failed to create scheduled export');
      return;
    }

    toast.success('Scheduled export created');
    setIsOpen(false);
    loadExports();
    setFormData({
      name: '',
      frequency: 'daily',
      export_format: 'csv',
      include_analytics: true,
      recipient_emails: '',
      retention_days: 30
    });
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('scheduled_batch_exports')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update export');
      return;
    }

    toast.success(isActive ? 'Export paused' : 'Export activated');
    loadExports();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this scheduled export?')) return;

    const { error } = await supabase
      .from('scheduled_batch_exports')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete export');
      return;
    }

    toast.success('Export deleted');
    loadExports();
  };

  const handleRunNow = async (id: string) => {
    toast.info('Triggering export...');
    
    const { error } = await supabase.functions.invoke('execute-scheduled-exports');
    
    if (error) {
      toast.error('Failed to trigger export');
      return;
    }

    toast.success('Export triggered successfully');
    loadExports();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scheduled Exports</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Schedule</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Scheduled Export</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={formData.frequency} onValueChange={v => setFormData({...formData, frequency: v as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Format</Label>
                <Select value={formData.export_format} onValueChange={v => setFormData({...formData, export_format: v as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Recipient Emails (comma-separated)</Label>
                <Input value={formData.recipient_emails} onChange={e => setFormData({...formData, recipient_emails: e.target.value})} />
              </div>
              <div>
                <Label>Retention Days</Label>
                <Input type="number" value={formData.retention_days} onChange={e => setFormData({...formData, retention_days: parseInt(e.target.value)})} />
              </div>
              <Button onClick={handleCreate} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {exports.map(exp => (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {exp.name}
                    <Badge variant={exp.is_active ? 'default' : 'secondary'}>
                      {exp.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {exp.frequency.charAt(0).toUpperCase() + exp.frequency.slice(1)} • {exp.export_format.toUpperCase()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Switch checked={exp.is_active} onCheckedChange={() => handleToggle(exp.id, exp.is_active)} />
                  <Button size="sm" variant="outline" onClick={() => handleRunNow(exp.id)}>
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(exp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{exp.recipient_emails.length} recipient(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Next: {new Date(exp.next_run_at).toLocaleDateString()}</span>
                </div>
                {exp.last_run_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Last: {new Date(exp.last_run_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}