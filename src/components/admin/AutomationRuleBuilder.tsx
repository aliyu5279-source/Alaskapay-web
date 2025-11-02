import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function AutomationRuleBuilder({ rule, onClose, onSave }: any) {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [triggerType, setTriggerType] = useState(rule?.trigger_type || 'new_user');
  const [conditions, setConditions] = useState(rule?.trigger_conditions || {});
  const [sequence, setSequence] = useState(rule?.email_sequence || []);
  const [templates, setTemplates] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*').eq('is_active', true);
    setTemplates(data || []);
  };

  const addSequenceStep = () => {
    setSequence([...sequence, { template_id: '', delay_hours: 0, subject: '' }]);
  };

  const updateSequenceStep = (index: number, field: string, value: any) => {
    const updated = [...sequence];
    updated[index] = { ...updated[index], [field]: value };
    setSequence(updated);
  };

  const removeSequenceStep = (index: number) => {
    setSequence(sequence.filter((_: any, i: number) => i !== index));
  };

  const handleSave = async () => {
    try {
      const ruleData = {
        name,
        description,
        trigger_type: triggerType,
        trigger_conditions: conditions,
        email_sequence: sequence,
        is_active: true
      };

      const action = rule ? 'update' : 'create';
      const body: any = { action, ruleData };
      if (rule) body.ruleId = rule.id;

      const { error } = await supabase.functions.invoke('manage-automation-rules', { body });
      if (error) throw error;

      toast({ title: 'Success', description: `Rule ${rule ? 'updated' : 'created'}` });
      onSave();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold">{rule ? 'Edit' : 'Create'} Automation Rule</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <Label>Rule Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome Series" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <Label>Trigger Type</Label>
          <Select value={triggerType} onValueChange={setTriggerType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_user">New User Registration</SelectItem>
              <SelectItem value="inactive_user">Inactive User</SelectItem>
              <SelectItem value="transaction_milestone">Transaction Milestone</SelectItem>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="anniversary">Anniversary</SelectItem>
              <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Email Sequence</h3>
          <Button onClick={addSequenceStep} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {sequence.map((step: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label>Template</Label>
                    <Select value={step.template_id} onValueChange={(v) => updateSequenceStep(index, 'template_id', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Delay (hours)</Label>
                    <Input type="number" value={step.delay_hours} onChange={(e) => updateSequenceStep(index, 'delay_hours', parseInt(e.target.value))} />
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeSequenceStep(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Rule</Button>
      </div>
    </div>
  );
}