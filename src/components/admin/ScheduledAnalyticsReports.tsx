import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function ScheduledAnalyticsReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    data_types: [] as string[],
    export_format: 'csv',
    frequency: 'weekly',
    recipients: '',
    start_date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const { data } = await supabase
      .from('scheduled_analytics_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setReports(data);
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.functions.invoke('schedule-analytics-report', {
        body: {
          action: editingReport ? 'update' : 'create',
          reportId: editingReport?.id,
          reportData: {
            ...formData,
            recipients: formData.recipients.split(',').map(e => e.trim())
          }
        }
      });

      if (error) throw error;

      toast.success(editingReport ? 'Report updated' : 'Report scheduled');
      setShowModal(false);
      setEditingReport(null);
      loadReports();
    } catch (error) {
      toast.error('Failed to save report');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.functions.invoke('schedule-analytics-report', {
        body: { action: 'delete', reportId: id }
      });
      toast.success('Report deleted');
      loadReports();
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  const dataTypeOptions = [
    { value: 'usage-trends', label: 'Usage Trends' },
    { value: 'popular-templates', label: 'Popular Templates' },
    { value: 'performance-metrics', label: 'Performance Metrics' },
    { value: 'category-distribution', label: 'Category Distribution' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scheduled Analytics Reports</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Report
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingReport(report);
                  setFormData({
                    name: report.name,
                    description: report.description,
                    data_types: report.data_types,
                    export_format: report.export_format,
                    frequency: report.frequency,
                    recipients: report.recipients.join(', '),
                    start_date: report.start_date
                  });
                  setShowModal(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {report.data_types.map((type: string) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {report.frequency}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {report.recipients.length} recipient(s)
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReport ? 'Edit' : 'Schedule'} Analytics Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <Label>Data Types</Label>
              <div className="space-y-2 mt-2">
                {dataTypeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.data_types.includes(option.value)}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          data_types: checked
                            ? [...formData.data_types, option.value]
                            : formData.data_types.filter(t => t !== option.value)
                        });
                      }}
                    />
                    <Label>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Format</Label>
                <Select value={formData.export_format} onValueChange={(v) => setFormData({...formData, export_format: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={formData.frequency} onValueChange={(v) => setFormData({...formData, frequency: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Recipients (comma-separated emails)</Label>
              <Input value={formData.recipients} onChange={(e) => setFormData({...formData, recipients: e.target.value})} placeholder="email1@example.com, email2@example.com" />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {editingReport ? 'Update' : 'Schedule'} Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}