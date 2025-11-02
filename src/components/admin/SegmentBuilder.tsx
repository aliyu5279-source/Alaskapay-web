import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SegmentBuilderProps {
  onSave: (segment: any) => void;
  initialSegment?: any;
}

export function SegmentBuilder({ onSave, initialSegment }: SegmentBuilderProps) {
  const [name, setName] = useState(initialSegment?.name || '');
  const [description, setDescription] = useState(initialSegment?.description || '');
  const [logic, setLogic] = useState<'AND' | 'OR'>(initialSegment?.conditions?.logic || 'AND');
  const [conditions, setConditions] = useState<Condition[]>(
    initialSegment?.conditions?.rules || [{ id: '1', field: '', operator: '', value: '' }]
  );

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now().toString(), field: '', operator: '', value: '' }]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      conditions: { logic, rules: conditions }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Segment Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Active Users" />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Conditions</Label>
          <Select value={logic} onValueChange={(v: 'AND' | 'OR') => setLogic(v)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {conditions.map((condition, idx) => (
          <div key={condition.id} className="flex gap-2 items-end">
            {idx > 0 && <span className="text-sm text-muted-foreground mb-2">{logic}</span>}
            <div className="flex-1 grid grid-cols-3 gap-2">
              <Select value={condition.field} onValueChange={(v) => updateCondition(condition.id, { field: v })}>
                <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="registration_date">Registration Date</SelectItem>
                  <SelectItem value="activity_level">Activity Level</SelectItem>
                  <SelectItem value="email_verified">Email Verified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={condition.operator} onValueChange={(v) => updateCondition(condition.id, { operator: v })}>
                <SelectTrigger><SelectValue placeholder="Operator" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_days">Last N Days</SelectItem>
                  <SelectItem value="before">Before</SelectItem>
                  <SelectItem value="after">After</SelectItem>
                  <SelectItem value="equals">Equals</SelectItem>
                </SelectContent>
              </Select>
              <Input value={condition.value} onChange={(e) => updateCondition(condition.id, { value: e.target.value })} placeholder="Value" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeCondition(condition.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" onClick={addCondition} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Condition
        </Button>
      </Card>

      <Button onClick={handleSave} className="w-full">Save Segment</Button>
    </div>
  );
}
