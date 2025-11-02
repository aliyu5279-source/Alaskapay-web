import { Card } from '@/components/ui/card';
import { BarChart3, LineChart, PieChart, Table, TrendingUp, Users, Mail, DollarSign } from 'lucide-react';

interface SectionPaletteProps {
  onAdd: (type: string) => void;
}

export function SectionPalette({ onAdd }: SectionPaletteProps) {
  const sections = [
    { type: 'metric', icon: TrendingUp, label: 'Metric Card', description: 'Single metric with trend' },
    { type: 'line-chart', icon: LineChart, label: 'Line Chart', description: 'Time series data' },
    { type: 'bar-chart', icon: BarChart3, label: 'Bar Chart', description: 'Comparison data' },
    { type: 'pie-chart', icon: PieChart, label: 'Pie Chart', description: 'Distribution data' },
    { type: 'table', icon: Table, label: 'Data Table', description: 'Detailed records' },
    { type: 'user-stats', icon: Users, label: 'User Stats', description: 'User metrics' },
    { type: 'email-stats', icon: Mail, label: 'Email Stats', description: 'Email engagement' },
    { type: 'revenue-stats', icon: DollarSign, label: 'Revenue Stats', description: 'Financial metrics' },
  ];

  return (
    <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
      {sections.map((section) => (
        <Card
          key={section.type}
          className="p-3 cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onAdd(section.type)}
        >
          <div className="flex items-start gap-3">
            <section.icon className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium text-sm">{section.label}</div>
              <div className="text-xs text-muted-foreground">{section.description}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
