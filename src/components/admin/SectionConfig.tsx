import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SectionConfigProps {
  section: any;
  onUpdate: (id: string, updates: any) => void;
}

export function SectionConfig({ section, onUpdate }: SectionConfigProps) {
  const updateConfig = (key: string, value: any) => {
    onUpdate(section.id, { config: { ...section.config, [key]: value } });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date Range</Label>
          <Select value={section.config.dateRange || '30d'} onValueChange={(v) => updateConfig('dateRange', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(section.type.includes('chart') || section.type === 'metric') && (
          <div>
            <Label>Metric</Label>
            <Select value={section.config.metric || 'users'} onValueChange={(v) => updateConfig('metric', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Total Users</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="transactions">Transactions</SelectItem>
                <SelectItem value="emails">Email Sends</SelectItem>
                <SelectItem value="opens">Email Opens</SelectItem>
                <SelectItem value="clicks">Email Clicks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={section.config.showComparison}
            onCheckedChange={(v) => updateConfig('showComparison', v)}
          />
          <Label>Show comparison with previous period</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={section.config.showTrend}
            onCheckedChange={(v) => updateConfig('showTrend', v)}
          />
          <Label>Show trend line</Label>
        </div>
      </div>

      {section.type === 'table' && (
        <div>
          <Label>Rows per page</Label>
          <Input
            type="number"
            value={section.config.rowsPerPage || 10}
            onChange={(e) => updateConfig('rowsPerPage', parseInt(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
