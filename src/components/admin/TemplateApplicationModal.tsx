import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface TemplateApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onComplete: () => void;
}

export function TemplateApplicationModal({ open, onOpenChange, selectedIds, onComplete }: TemplateApplicationModalProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [applyBranding, setApplyBranding] = useState(true);
  const [applySections, setApplySections] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) loadTemplates();
  }, [open]);

  const loadTemplates = async () => {
    const { data } = await supabase
      .from('custom_report_templates')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTemplates(data);
  };

  const handleApply = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    setIsProcessing(true);
    try {
      const { data: template } = await supabase
        .from('custom_report_templates')
        .select('*')
        .eq('id', selectedTemplate)
        .single();

      if (!template) {
        toast.error('Template not found');
        return;
      }

      for (const reportId of selectedIds) {
        const updates: any = {};
        if (applyBranding) updates.branding = template.branding;
        if (applySections) updates.sections = template.sections;

        await supabase
          .from('custom_report_templates')
          .update(updates)
          .eq('id', reportId);
      }

      toast.success(`Applied template to ${selectedIds.length} reports`);
      onComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to apply template');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply Template to {selectedIds.length} Reports</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Select Template</Label>
            <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="mt-2 space-y-2">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={template.id} id={template.id} />
                  <Label htmlFor={template.id} className="flex-1 cursor-pointer">
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Apply Settings</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="branding" checked={applyBranding} onCheckedChange={(checked) => setApplyBranding(checked as boolean)} />
              <Label htmlFor="branding" className="cursor-pointer">Apply branding (colors, logo)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sections" checked={applySections} onCheckedChange={(checked) => setApplySections(checked as boolean)} />
              <Label htmlFor="sections" className="cursor-pointer">Apply sections layout</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isProcessing || !selectedTemplate}>
            {isProcessing ? 'Applying...' : 'Apply Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
