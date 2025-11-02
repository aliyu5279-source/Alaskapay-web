import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, Trash2, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ScheduledReportsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScheduledReportsModal({ open, onClose }: ScheduledReportsModalProps) {

  const [schedules, setSchedules] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    report_name: '',
    report_type: 'executive_summary',
    frequency: 'weekly',
    recipients: '',
    format: 'pdf'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) loadSchedules();
  }, [open]);

  const loadSchedules = async () => {
    const { data } = await supabase
      .from('scheduled_reports')
      .select('*')
      .order('created_at', { ascending: false });
    setSchedules(data || []);
  };

  const handleCreate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.functions.invoke('schedule-report', {
        body: {
          action: 'create',
          scheduleData: {
            ...formData,
            admin_id: user?.id,
            recipients: formData.recipients.split(',').map(e => e.trim())
          }
        }
      });

      if (error) throw error;

      toast({ title: 'Report scheduled successfully' });
      setShowForm(false);
      setFormData({ report_name: '', report_type: 'executive_summary', frequency: 'weekly', recipients: '', format: 'pdf' });
      loadSchedules();
    } catch (error: any) {
      toast({ title: 'Failed to schedule report', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.functions.invoke('schedule-report', {
        body: { action: 'delete', scheduleId: id }
      });
      toast({ title: 'Schedule deleted' });
      loadSchedules();
    } catch (error: any) {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scheduled Reports</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule New Report
            </Button>
          )}

          {showForm && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div>
                <Label>Report Name</Label>
                <Input value={formData.report_name} onChange={(e) => setFormData({ ...formData, report_name: e.target.value })} />
              </div>
              <div>
                <Label>Report Type</Label>
                <Select value={formData.report_type} onValueChange={(v) => setFormData({ ...formData, report_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive_summary">Executive Summary</SelectItem>
                    <SelectItem value="detailed_metrics">Detailed Metrics</SelectItem>
                    <SelectItem value="campaign_performance">Campaign Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Export Format</Label>
                <Select value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Only</SelectItem>
                    <SelectItem value="excel">Excel Only</SelectItem>
                    <SelectItem value="both">Both PDF & Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Recipients (comma-separated emails)</Label>
                <Input value={formData.recipients} onChange={(e) => setFormData({ ...formData, recipients: e.target.value })} placeholder="email1@example.com, email2@example.com" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreate} className="flex-1">Create Schedule</Button>
                <Button onClick={() => setShowForm(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{schedule.report_name}</div>
                  <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                    <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{schedule.frequency}</Badge>
                    <Badge variant="outline"><Mail className="w-3 h-3 mr-1" />{schedule.recipients?.length || 0} recipients</Badge>
                    <Badge variant="outline"><FileText className="w-3 h-3 mr-1" />{schedule.format || 'pdf'}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(schedule.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
