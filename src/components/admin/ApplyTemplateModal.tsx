import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ApplyTemplateModalProps {
  template: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplyTemplateModal({ template, open, onClose, onSuccess }: ApplyTemplateModalProps) {
  const [name, setName] = useState(`${template.name} - Schedule`);
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('09:00');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-export-templates', {
        body: {
          action: 'apply',
          templateId: template.id,
          scheduleData: {
            name,
            frequency,
            schedule_time: time,
            enabled
          }
        }
      });

      if (error) throw error;

      toast.success('Template applied successfully! Scheduled export created.');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Failed to apply template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply Template: {template.name}</DialogTitle>
          <DialogDescription>
            Create a scheduled export using this template configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Schedule Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter schedule name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Execution Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable immediately</Label>
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-medium">Template Configuration:</p>
            <p>• Format: {template.export_format.toUpperCase()}</p>
            <p>• Analytics: {template.include_analytics ? 'Included' : 'Not included'}</p>
            <p>• Recipients: {template.email_recipients?.length || 0} email(s)</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply} disabled={loading || !name}>
            {loading ? 'Creating...' : 'Create Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}