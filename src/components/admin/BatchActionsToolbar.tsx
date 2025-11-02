import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, Trash2, FileText, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface BatchActionsToolbarProps {
  selectedIds: Set<string>;
  onClearSelection: () => void;
  onComplete: () => void;
  onApplyTemplate: () => void;
}

export function BatchActionsToolbar({ selectedIds, onClearSelection, onComplete, onApplyTemplate }: BatchActionsToolbarProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkExport = async () => {
    setIsProcessing(true);
    try {
      const { data } = await supabase
        .from('custom_report_templates')
        .select('*')
        .in('id', Array.from(selectedIds));

      if (data) {
        const exportData = JSON.stringify(data, null, 2);
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reports-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported ${data.length} reports`);
      }
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDuplicate = async () => {
    setIsProcessing(true);
    try {
      const { data } = await supabase
        .from('custom_report_templates')
        .select('*')
        .in('id', Array.from(selectedIds));

      if (data) {
        const duplicates = data.map(report => ({
          name: `${report.name} (Copy)`,
          description: report.description,
          template_type: report.template_type,
          branding: report.branding,
          sections: report.sections
        }));

        const { error } = await supabase
          .from('custom_report_templates')
          .insert(duplicates);

        if (!error) {
          toast.success(`Duplicated ${duplicates.length} reports`);
          onComplete();
          onClearSelection();
        } else {
          toast.error('Duplication failed');
        }
      }
    } catch (error) {
      toast.error('Duplication failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('custom_report_templates')
        .delete()
        .in('id', Array.from(selectedIds));

      if (!error) {
        toast.success(`Deleted ${selectedIds.size} reports`);
        onComplete();
        onClearSelection();
      } else {
        toast.error('Deletion failed');
      }
    } catch (error) {
      toast.error('Deletion failed');
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <span className="font-semibold">{selectedIds.size} selected</span>
        <div className="flex-1" />
        <Button onClick={handleBulkExport} variant="outline" size="sm" disabled={isProcessing}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button onClick={handleBulkDuplicate} variant="outline" size="sm" disabled={isProcessing}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </Button>
        <Button onClick={onApplyTemplate} variant="outline" size="sm" disabled={isProcessing}>
          <FileText className="w-4 h-4 mr-2" />
          Apply Template
        </Button>
        <Button onClick={() => setShowDeleteConfirm(true)} variant="destructive" size="sm" disabled={isProcessing}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <Button onClick={onClearSelection} variant="ghost" size="icon">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} reports?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All selected reports and their associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
