import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function CommissionRulesManager() {
  const [rules, setRules] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    const { data } = await supabase
      .from('commission_rules')
      .select('*')
      .order('priority', { ascending: false });
    setRules(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const rule = {
      name: formData.get('name'),
      rule_type: formData.get('rule_type'),
      calculation_method: formData.get('calculation_method'),
      base_rate: parseFloat(formData.get('base_rate') as string),
      min_amount: parseFloat(formData.get('min_amount') as string) || 0,
      max_amount: parseFloat(formData.get('max_amount') as string) || null,
      is_active: formData.get('is_active') === 'on',
      priority: parseInt(formData.get('priority') as string) || 0
    };

    try {
      if (editing?.id) {
        await supabase.from('commission_rules').update(rule).eq('id', editing.id);
        toast.success('Rule updated');
      } else {
        await supabase.from('commission_rules').insert(rule);
        toast.success('Rule created');
      }
      setEditing(null);
      loadRules();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this rule?')) return;
    await supabase.from('commission_rules').delete().eq('id', id);
    toast.success('Rule deleted');
    loadRules();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Commission Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between border p-4 rounded">
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {rule.rule_type} • {rule.calculation_method} • {rule.base_rate}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => setEditing({})} className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Add Rule
          </Button>
        </CardContent>
      </Card>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>{editing.id ? 'Edit' : 'Create'} Commission Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label>Rule Name</Label>
                <Input name="name" defaultValue={editing.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select name="rule_type" defaultValue={editing.rule_type}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="transaction">Transaction</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Method</Label>
                  <Select name="calculation_method" defaultValue={editing.calculation_method}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Rate (%)</Label>
                  <Input name="base_rate" type="number" step="0.01" defaultValue={editing.base_rate} />
                </div>
                <div>
                  <Label>Min Amount</Label>
                  <Input name="min_amount" type="number" defaultValue={editing.min_amount} />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Input name="priority" type="number" defaultValue={editing.priority} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch name="is_active" defaultChecked={editing.is_active} />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}