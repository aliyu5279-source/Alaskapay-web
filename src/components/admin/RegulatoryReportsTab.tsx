import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileText, Download, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function RegulatoryReportsTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    report_type: 'cbn_monthly',
    period_start: '',
    period_end: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const { data } = await supabase
      .from('regulatory_reports')
      .select('*')
      .order('generated_date', { ascending: false });
    setReports(data || []);
  };

  const generateReport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.functions.invoke('generate-regulatory-report', {
        body: { ...formData, user_id: user?.id }
      });

      if (error) throw error;
      toast({ title: 'Report generated successfully' });
      setOpen(false);
      loadReports();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const exportReport = (report: any) => {
    const blob = new Blob([JSON.stringify(report.report_data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.report_type}_${report.reporting_period_start}.json`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><FileText className="w-4 h-4 mr-2" />Generate Report</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Regulatory Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Report Type</Label>
                <Select value={formData.report_type} onValueChange={(v) => setFormData({...formData, report_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cbn_monthly">CBN Monthly Returns</SelectItem>
                    <SelectItem value="cbn_quarterly">CBN Quarterly Report</SelectItem>
                    <SelectItem value="ndpr_annual">NDPR Annual Report</SelectItem>
                    <SelectItem value="pci_dss_quarterly">PCI-DSS Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Period Start</Label>
                <Input type="date" value={formData.period_start} onChange={(e) => setFormData({...formData, period_start: e.target.value})} />
              </div>
              <div>
                <Label>Period End</Label>
                <Input type="date" value={formData.period_end} onChange={(e) => setFormData({...formData, period_end: e.target.value})} />
              </div>
              <Button onClick={generateReport} className="w-full">Generate</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(report => (
                <TableRow key={report.id}>
                  <TableCell><Badge variant="outline">{report.regulation_type}</Badge> {report.report_type.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-sm">{report.reporting_period_start} to {report.reporting_period_end}</TableCell>
                  <TableCell className="text-sm">{new Date(report.generated_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm">{report.submission_deadline}</TableCell>
                  <TableCell><Badge className={getStatusColor(report.status)}>{report.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => exportReport(report)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      {report.status === 'approved' && (
                        <Button size="sm"><Send className="w-4 h-4" /></Button>
                      )}
                    </div>
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