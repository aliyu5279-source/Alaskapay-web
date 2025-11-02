import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function CreateTemplateModal({ open, onClose, onSuccess, initialData }: CreateTemplateModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'custom');
  const [exportFormat, setExportFormat] = useState(initialData?.export_format || 'csv');
  const [includeAnalytics, setIncludeAnalytics] = useState(initialData?.include_analytics ?? true);
  const [emailRecipients, setEmailRecipients] = useState(initialData?.email_recipients?.join(', ') || '');
  const [emailSubject, setEmailSubject] = useState(initialData?.email_subject || '');
  const [emailBody, setEmailBody] = useState(initialData?.email_body || '');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) {
      toast.error('Please enter a template name');
      return;
    }

    setLoading(true);
    try {
      const recipients = emailRecipients
        .split(',')
        .map(e => e.trim())
        .filter(e => e);

      const { error } = await supabase.functions.invoke('manage-export-templates', {
        body: {
          action: 'create',
          templateData: {
            name,
            description,
            category,
            export_format: exportFormat,
            include_analytics: includeAnalytics,
            filters: initialData?.filters || {},
            email_recipients: recipients,
            email_subject: emailSubject,
            email_body: emailBody,
            is_public: isPublic
          }
        }
      });

      if (error) throw error;

      toast.success('Template created successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Failed to create template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Export Template</DialogTitle>
          <DialogDescription>
            Save your export configuration as a reusable template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Daily Activity Report"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily_reports">Daily Reports</SelectItem>
                  <SelectItem value="weekly_summaries">Weekly Summaries</SelectItem>
                  <SelectItem value="monthly_analytics">Monthly Analytics</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-8">
              <Label htmlFor="analytics">Include Analytics</Label>
              <Switch
                id="analytics"
                checked={includeAnalytics}
                onCheckedChange={setIncludeAnalytics}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Email Recipients (comma-separated)</Label>
            <Input
              id="recipients"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              placeholder="admin@example.com, team@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Batch History Export Report"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Email Body</Label>
            <Textarea
              id="body"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Your scheduled export report is attached..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <Label>Make Public</Label>
              <p className="text-xs text-muted-foreground">Allow all users to use this template</p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading || !name}>
            {loading ? 'Creating...' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}