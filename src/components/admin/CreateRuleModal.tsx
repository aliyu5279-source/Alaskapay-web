import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CreateRuleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRuleModal({ open, onClose, onSuccess }: CreateRuleModalProps) {
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: 'velocity',
    severity: 'medium',
    action: 'flag',
    description: '',
    threshold_config: '{}'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.functions.invoke('manage-fraud-rules', {
        body: {
          action: 'create',
          ruleData: {
            ...formData,
            threshold_config: JSON.parse(formData.threshold_config)
          }
        }
      });

      if (error) throw error;
      toast.success('Rule created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to create rule');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Fraud Detection Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rule Name</Label>
            <Input
              value={formData.rule_name}
              onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rule Type</Label>
              <Select value={formData.rule_type} onValueChange={(v) => setFormData({ ...formData, rule_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="velocity">Velocity</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="geographic">Geographic</SelectItem>
                  <SelectItem value="device">Device</SelectItem>
                  <SelectItem value="pattern">Pattern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Severity</Label>
              <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Action</Label>
            <Select value={formData.action} onValueChange={(v) => setFormData({ ...formData, action: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flag">Flag</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Threshold Config (JSON)</Label>
            <Textarea
              value={formData.threshold_config}
              onChange={(e) => setFormData({ ...formData, threshold_config: e.target.value })}
              placeholder='{"max_transactions": 5, "time_window_minutes": 10}'
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Create Rule</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
