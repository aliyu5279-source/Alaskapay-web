import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function ComplianceDeadlinesTab() {
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    regulation_type: 'CBN',
    deadline_type: 'report_submission',
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = async () => {
    const { data } = await supabase
      .from('compliance_deadlines')
      .select('*')
      .order('due_date', { ascending: true });
    setDeadlines(data || []);
  };

  const createDeadline = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('compliance_deadlines').insert({
        ...formData,
        assigned_to: user?.id
      });

      toast({ title: 'Deadline created' });
      setOpen(false);
      setFormData({ regulation_type: 'CBN', deadline_type: 'report_submission', title: '', description: '', due_date: '', priority: 'medium' });
      loadDeadlines();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const markComplete = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('compliance_deadlines').update({
        status: 'completed',
        completed_date: new Date().toISOString(),
        completed_by: user?.id
      }).eq('id', id);

      toast({ title: 'Deadline marked as complete' });
      loadDeadlines();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getDaysUntil = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    const days = getDaysUntil(dueDate);
    if (days < 0) return 'bg-red-100 text-red-800';
    if (days <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Deadline</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Compliance Deadline</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Regulation Type</Label>
                <Select value={formData.regulation_type} onValueChange={(v) => setFormData({...formData, regulation_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBN">CBN</SelectItem>
                    <SelectItem value="NDPR">NDPR</SelectItem>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="PCI_DSS">PCI-DSS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Deadline Type</Label>
                <Select value={formData.deadline_type} onValueChange={(v) => setFormData({...formData, deadline_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report_submission">Report Submission</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="renewal">Renewal</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
              </div>
              <Button onClick={createDeadline} className="w-full">Create Deadline</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Regulation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deadlines.map(deadline => {
                const daysUntil = getDaysUntil(deadline.due_date);
                return (
                  <TableRow key={deadline.id}>
                    <TableCell className="font-medium">{deadline.title}</TableCell>
                    <TableCell><Badge variant="outline">{deadline.regulation_type}</Badge></TableCell>
                    <TableCell className="text-sm">{deadline.deadline_type.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{deadline.due_date}</TableCell>
                    <TableCell>
                      <span className={daysUntil < 0 ? 'text-red-600 font-semibold' : daysUntil <= 7 ? 'text-yellow-600 font-semibold' : ''}>
                        {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(deadline.status, deadline.due_date)}>{deadline.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {deadline.status !== 'completed' && (
                        <Button size="sm" onClick={() => markComplete(deadline.id)}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}