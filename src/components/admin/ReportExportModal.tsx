import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ReportExportModalProps {
  open: boolean;
  onClose: () => void;
  filters: any;
  data: any;
}

export function ReportExportModal({ open, onClose, filters, data }: ReportExportModalProps) {
  const [reportType, setReportType] = useState('executive_summary');
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'executive_summary', label: 'Executive Summary', desc: 'High-level overview for executives' },
    { value: 'detailed_metrics', label: 'Detailed Metrics', desc: 'Comprehensive data analysis' },
    { value: 'campaign_performance', label: 'Campaign Performance', desc: 'Email campaign insights' }
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      const functionName = format === 'pdf' ? 'generate-pdf-report' : 'generate-excel-report';
      
      const { data: result, error } = await supabase.functions.invoke(functionName, {
        body: { reportType, filters, data }
      });

      if (error) throw error;

      if (format === 'pdf') {
        const blob = new Blob([result.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        const blob = new Blob([result.csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        a.click();
      }

      toast({ title: 'Report generated successfully' });
      onClose();
    } catch (error: any) {
      toast({ title: 'Export failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Report Template</Label>
            <RadioGroup value={reportType} onValueChange={setReportType}>
              {reportTypes.map((type) => (
                <div key={type.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className="flex-1">
                    <Label htmlFor={type.value} className="font-medium cursor-pointer">{type.label}</Label>
                    <p className="text-sm text-muted-foreground">{type.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="flex gap-3">
              <Button
                variant={format === 'pdf' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFormat('pdf')}
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                variant={format === 'excel' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFormat('excel')}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
          <Button onClick={handleExport} disabled={loading} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Export Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
