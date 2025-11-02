import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Play, Pause, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AutomationRuleBuilder } from './AutomationRuleBuilder';

export function AutomationRulesTab() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-automation-rules', {
        body: { action: 'list' }
      });
      if (error) throw error;
      setRules(data.rules || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      await supabase.functions.invoke('manage-automation-rules', {
        body: { action: 'update', ruleId, ruleData: { is_active: !isActive } }
      });
      toast({ title: 'Success', description: 'Rule updated' });
      loadRules();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!confirm('Delete this automation rule?')) return;
    try {
      await supabase.functions.invoke('manage-automation-rules', {
        body: { action: 'delete', ruleId }
      });
      toast({ title: 'Success', description: 'Rule deleted' });
      loadRules();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getTriggerLabel = (type: string) => {
    const labels: any = {
      new_user: 'New User Registration',
      inactive_user: 'Inactive User',
      transaction_milestone: 'Transaction Milestone',
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      abandoned_cart: 'Abandoned Cart'
    };
    return labels[type] || type;
  };

  if (showBuilder || editingRule) {
    return (
      <AutomationRuleBuilder
        rule={editingRule}
        onClose={() => { setShowBuilder(false); setEditingRule(null); }}
        onSave={() => { setShowBuilder(false); setEditingRule(null); loadRules(); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Automation Rules</h2>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{rule.name}</h3>
                  <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                    {rule.is_active ? 'Active' : 'Paused'}
                  </Badge>
                  <Badge variant="outline">{getTriggerLabel(rule.trigger_type)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{rule.description}</p>
                <div className="flex gap-4 text-sm">
                  <span>Executions: {rule.total_executions || 0}</span>
                  <span>Emails Sent: {rule.total_emails_sent || 0}</span>
                  <span>Sequence Steps: {rule.email_sequence?.length || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={rule.is_active} onCheckedChange={() => toggleRule(rule.id, rule.is_active)} />
                <Button variant="ghost" size="sm" onClick={() => setEditingRule(rule)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}