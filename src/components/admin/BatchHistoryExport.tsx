import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download, FileJson, FileSpreadsheet, Calendar, Save } from 'lucide-react';
import { toast } from 'sonner';
import { exportBatchHistoryToCSV, exportBatchHistoryToJSON, generateAnalyticsReport } from '@/lib/batchHistoryExport';
import { CreateTemplateModal } from './CreateTemplateModal';

interface BatchHistoryItem {
  id: string;
  timestamp: number;
  duration: number;
  operationCount: number;
  preview: string;
  fieldType?: string;
}

interface Props {
  batches: BatchHistoryItem[];
}

export function BatchHistoryExport({ batches }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fieldType, setFieldType] = useState('all');
  const [minOps, setMinOps] = useState('');
  const [maxOps, setMaxOps] = useState('');
  const [includeAnalytics, setIncludeAnalytics] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const filterBatches = () => {
    return batches.filter(b => {
      if (startDate && b.timestamp < new Date(startDate).getTime()) return false;
      if (endDate && b.timestamp > new Date(endDate).getTime()) return false;
      if (fieldType !== 'all' && b.fieldType !== fieldType) return false;
      if (minOps && b.operationCount < parseInt(minOps)) return false;
      if (maxOps && b.operationCount > parseInt(maxOps)) return false;
      return true;
    });
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const filtered = filterBatches();
    const csv = exportBatchHistoryToCSV(filtered, includeAnalytics);
    downloadFile(csv, `batch-history-${Date.now()}.csv`, 'text/csv');
    toast.success(`CSV exported: ${filtered.length} batches`);
  };

  const handleExportJSON = () => {
    const filtered = filterBatches();
    const json = exportBatchHistoryToJSON(filtered, includeAnalytics);
    downloadFile(json, `batch-history-${Date.now()}.json`, 'application/json');
    toast.success(`JSON exported: ${filtered.length} batches`);
  };

  const handleExportReport = () => {
    const filtered = filterBatches();
    const report = generateAnalyticsReport(filtered);
    downloadFile(report, `analytics-report-${Date.now()}.txt`, 'text/plain');
    toast.success('Analytics report downloaded');
  };

  const handleSaveAsTemplate = () => {
    setShowTemplateModal(true);
  };

  const getCurrentFilters = () => ({
    dateRange: startDate && endDate ? { from: startDate, to: endDate } : null,
    fieldTypes: fieldType !== 'all' ? [fieldType] : [],
    minOperations: minOps ? parseInt(minOps) : null,
    maxOperations: maxOps ? parseInt(maxOps) : null
  });


  const fieldTypes = Array.from(new Set(batches.map(b => b.fieldType).filter(Boolean)));

  return (
    <>
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Export Batch History</h3>
          <Button onClick={handleSaveAsTemplate} size="sm" variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Field Type</Label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {fieldTypes.map(t => <SelectItem key={t} value={t!}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Min Operations</Label>
            <Input type="number" value={minOps} onChange={e => setMinOps(e.target.value)} />
          </div>
          <div>
            <Label>Max Operations</Label>
            <Input type="number" value={maxOps} onChange={e => setMaxOps(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label>Include Analytics</Label>
          <Switch checked={includeAnalytics} onCheckedChange={setIncludeAnalytics} />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleExportCSV} size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" />CSV
          </Button>
          <Button onClick={handleExportJSON} size="sm" variant="outline">
            <FileJson className="w-4 h-4 mr-2" />JSON
          </Button>
          <Button onClick={handleExportReport} size="sm" variant="secondary">
            <Download className="w-4 h-4 mr-2" />Report
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {filterBatches().length} of {batches.length} batches match filters
        </p>
      </Card>

      <CreateTemplateModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSuccess={() => {
          setShowTemplateModal(false);
          toast.success('Template saved successfully');
        }}
        initialData={{
          export_format: 'csv',
          include_analytics: includeAnalytics,
          filters: getCurrentFilters()
        }}
      />
    </>
  );
}
