import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImportReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

export default function ImportReportsModal({ open, onOpenChange, onImportComplete }: ImportReportsModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [conflictResolution, setConflictResolution] = useState('rename');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    const allReports: any[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const fileReports = Array.isArray(json) ? json : [json];

        for (const report of fileReports) {
          if (!report.name || !report.sections) {
            errors.push(`${file.name}: Missing required fields`);
          } else {
            allReports.push(report);
          }
        }
      } catch (error) {
        errors.push(`${file.name}: Invalid JSON`);
      }
    }

    setReports(allReports);
    setValidationErrors(errors);

    // Check for conflicts
    const { data: existing } = await supabase
      .from('custom_report_templates')
      .select('name');

    const existingNames = new Set(existing?.map(r => r.name) || []);
    const conflictNames = allReports
      .map(r => r.name)
      .filter(name => existingNames.has(name));

    setConflicts(conflictNames);
    if (allReports.length > 0) setStep('preview');
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('import-reports', {
        body: { reports, conflictResolution, userId: user?.id }
      });

      if (error) throw error;

      setImportResult(data);
      
      // Save import history
      await supabase.from('import_history').insert({
        imported_by: user?.id,
        file_name: files.map(f => f.name).join(', '),
        reports_count: reports.length,
        successful_imports: data.successful.length,
        failed_imports: data.failed.length,
        conflicts_resolved: data.conflicts.length,
        import_details: data
      });

      setStep('complete');
      onImportComplete();
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const resetModal = () => {
    setFiles([]);
    setReports([]);
    setConflicts([]);
    setValidationErrors([]);
    setStep('upload');
    setImportResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Reports</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium">Choose JSON files</span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </Label>
              <p className="text-xs text-muted-foreground mt-2">
                Select one or more JSON files to import
              </p>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h4 className="font-medium mb-2">Reports to Import ({reports.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {reports.map((report, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileJson className="h-4 w-4" />
                    <span className="text-sm">{report.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {conflicts.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-amber-600">
                  Conflicts Detected ({conflicts.length})
                </h4>
                <RadioGroup value={conflictResolution} onValueChange={setConflictResolution}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skip" id="skip" />
                    <Label htmlFor="skip">Skip conflicting reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rename" id="rename" />
                    <Label htmlFor="rename">Rename with "(Imported)" suffix</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overwrite" id="overwrite" />
                    <Label htmlFor="overwrite">Overwrite existing reports</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetModal}>Cancel</Button>
              <Button onClick={handleImport} disabled={importing || reports.length === 0}>
                {importing ? 'Importing...' : 'Import Reports'}
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && importResult && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Import completed: {importResult.successful.length} successful, 
                {importResult.failed.length} failed
              </AlertDescription>
            </Alert>
            <Button onClick={resetModal} className="w-full">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}