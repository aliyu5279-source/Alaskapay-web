import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { CreateRuleModal } from './CreateRuleModal';
import { toast } from 'sonner';

export function FraudRulesManager() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-fraud-rules', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
      toast.error('Failed to load fraud rules');
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      await supabase.functions.invoke('manage-fraud-rules', {
        body: { action: 'toggle', ruleId, ruleData: { is_active: !isActive } }
      });
      toast.success(`Rule ${!isActive ? 'enabled' : 'disabled'}`);
      loadRules();
    } catch (error) {
      toast.error('Failed to toggle rule');
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fraud Detection Rules</CardTitle>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{rule.rule_name}</h4>
                        <Badge className={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                        <Badge variant="outline">{rule.rule_type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {rule.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Action: <strong>{rule.action}</strong>
                        </span>
                        <span className="text-muted-foreground">
                          Config: <code className="text-xs bg-muted px-2 py-1 rounded">
                            {JSON.stringify(rule.threshold_config)}
                          </code>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => toggleRule(rule.id, rule.is_active)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {showCreateModal && (
        <CreateRuleModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadRules}
        />
      )}
    </>
  );
}
