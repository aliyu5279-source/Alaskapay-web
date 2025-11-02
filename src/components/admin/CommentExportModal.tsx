import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CommentExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  reportName: string;
}

export function CommentExportModal({ open, onOpenChange, reportId, reportName }: CommentExportModalProps) {
  const [resolvedFilter, setResolvedFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (resolvedFilter !== 'all') {
        filters.resolved = resolvedFilter === 'resolved';
      }
      if (startDate) filters.startDate = startDate.toISOString();
      if (endDate) filters.endDate = endDate.toISOString();

      // Fetch comments with filters
      let query = supabase
        .from('report_comments')
        .select('*, user:profiles(full_name, email)')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true });

      if (filters.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data: comments, error } = await query;
      if (error) throw error;

      // Generate PDF HTML
      const html = generatePDFHTML(comments, reportName, filters);
      
      // Create blob and download
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName}-comments-${format(new Date(), 'yyyy-MM-dd')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: `Exported ${comments.length} comments`,
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Comments
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Status Filter</Label>
            <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Comments</SelectItem>
                <SelectItem value="resolved">Resolved Only</SelectItem>
                <SelectItem value="unresolved">Unresolved Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={handleExport} disabled={loading} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Exporting...' : 'Export to PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generatePDFHTML(comments: any[], reportName: string, filters: any) {
  const now = new Date().toLocaleString();
  const filterDesc = [];
  if (filters.resolved !== undefined) filterDesc.push(filters.resolved ? 'Resolved' : 'Unresolved');
  if (filters.startDate) filterDesc.push(`From: ${format(new Date(filters.startDate), 'PPP')}`);
  if (filters.endDate) filterDesc.push(`To: ${format(new Date(filters.endDate), 'PPP')}`);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${reportName} - Comments Summary</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1f2937; }
    h1 { color: #111827; margin-bottom: 10px; }
    .meta { color: #6b7280; font-size: 14px; margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .meta p { margin: 5px 0; }
    .comment { border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 4px; }
    .comment.resolved { border-left-color: #10b981; background: #f0fdf4; }
    .comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .user { font-weight: bold; color: #111827; font-size: 15px; }
    .timestamp { color: #9ca3af; font-size: 12px; margin-top: 4px; }
    .section { color: #3b82f6; font-size: 13px; font-weight: 500; margin-bottom: 8px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .status.resolved { background: #d1fae5; color: #065f46; }
    .status.unresolved { background: #fee2e2; color: #991b1b; }
    .content { color: #374151; line-height: 1.6; margin-top: 12px; }
    .resolved-info { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #059669; font-size: 12px; }
    @media print {
      body { margin: 20px; }
      .comment { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${reportName}</h1>
  <h2 style="color: #6b7280; font-weight: normal; margin-top: 0;">Comments Summary</h2>
  
  <div class="meta">
    <p><strong>Generated:</strong> ${now}</p>
    <p><strong>Total Comments:</strong> ${comments.length}</p>
    ${filterDesc.length > 0 ? `<p><strong>Filters Applied:</strong> ${filterDesc.join(', ')}</p>` : ''}
  </div>

  ${comments.length === 0 ? '<p style="text-align: center; color: #9ca3af; padding: 40px;">No comments found matching the selected filters.</p>' : ''}

  ${comments.map(c => `
    <div class="comment ${c.resolved ? 'resolved' : ''}">
      <div class="section">📍 Section: ${c.section_id || 'General Report'}</div>
      <div class="comment-header">
        <div>
          <div class="user">${c.user?.full_name || c.user?.email || 'Unknown User'}</div>
          <div class="timestamp">${format(new Date(c.created_at), 'PPP p')}</div>
        </div>
        <span class="status ${c.resolved ? 'resolved' : 'unresolved'}">
          ${c.resolved ? '✓ Resolved' : '○ Unresolved'}
        </span>
      </div>
      <div class="content">${c.content.replace(/\n/g, '<br>')}</div>
      ${c.resolved_at ? `
        <div class="resolved-info">
          ✓ Resolved on ${format(new Date(c.resolved_at), 'PPP p')}
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>Generated from Custom Report Builder • ${format(new Date(), 'PPP')}</p>
  </div>
</body>
</html>`;
}