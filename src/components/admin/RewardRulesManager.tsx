import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, DollarSign, Percent } from 'lucide-react';
import { toast } from 'sonner';

export function RewardRulesManager() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rule_type: 'first_transaction',
    reward_amount: '',
    reward_percentage: '',
    max_reward_amount: '',
    min_transaction_amount: '',
    required_transaction_count: 1,
    time_window_days: '',
    auto_approve: true,
    requires_kyc: false,
    active: true,
    priority: 0
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-reward-rules', {
        body: { action: 'list' }
      });
      if (error) throw error;
      setRules(data.rules || []);
    } catch (error) {
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = editingRule ? 'update' : 'create';
      const body = editingRule 
        ? { action, rule_id: editingRule.id, rule_data: formData }
        : { action, rule_data: formData };

      const { error } = await supabase.functions.invoke('manage-reward-rules', { body });
      if (error) throw error;

      toast.success(`Rule ${editingRule ? 'updated' : 'created'} successfully`);
      setDialogOpen(false);
      resetForm();
      loadRules();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', rule_type: 'first_transaction',
      reward_amount: '', reward_percentage: '', max_reward_amount: '',
      min_transaction_amount: '', required_transaction_count: 1,
      time_window_days: '', auto_approve: true, requires_kyc: false,
      active: true, priority: 0
    });
    setEditingRule(null);
  };

  const handleToggle = async (ruleId) => {
    try {
      await supabase.functions.invoke('manage-reward-rules', {
        body: { action: 'toggle', rule_id: ruleId }
      });
      loadRules();
    } catch (error) {
      toast.error('Failed to toggle rule');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reward Rules</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2" />Add Rule</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit' : 'Create'} Reward Rule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
              <div><Label>Rule Type</Label>
                <Select value={formData.rule_type} onValueChange={(v) => setFormData({...formData, rule_type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_transaction">First Transaction</SelectItem>
                    <SelectItem value="transaction_amount">Transaction Amount</SelectItem>
                    <SelectItem value="transaction_count">Transaction Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Fixed Amount ($)</Label><Input type="number" step="0.01" value={formData.reward_amount} onChange={(e) => setFormData({...formData, reward_amount: e.target.value})} /></div>
                <div><Label>Percentage (%)</Label><Input type="number" step="0.01" value={formData.reward_percentage} onChange={(e) => setFormData({...formData, reward_percentage: e.target.value})} /></div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={formData.auto_approve} onCheckedChange={(v) => setFormData({...formData, auto_approve: v})} />
                <Label>Auto Approve</Label>
              </div>
              <Button type="submit" className="w-full">Save Rule</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{rule.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Switch checked={rule.active} onCheckedChange={() => handleToggle(rule.id)} />
                <Button size="sm" variant="outline" onClick={() => { setEditingRule(rule); setFormData(rule); setDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
              <div className="flex gap-4 text-sm">
                {rule.reward_amount && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" />${rule.reward_amount}</span>}
                {rule.reward_percentage && <span className="flex items-center"><Percent className="w-4 h-4 mr-1" />{rule.reward_percentage}%</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}