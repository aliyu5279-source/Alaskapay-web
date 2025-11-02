import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart, PieChart, Trash2, Plus } from 'lucide-react';

interface ChartConfigPanelProps {
  charts: any[];
  onChange: (charts: any[]) => void;
}

export function ChartConfigPanel({ charts, onChange }: ChartConfigPanelProps) {
  const [selectedChart, setSelectedChart] = useState<number | null>(null);

  const addChart = () => {
    onChange([...charts, {
      id: `chart-${Date.now()}`,
      type: 'bar',
      title: 'New Chart',
      dataSource: 'chartData.userGrowth',
      colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
      series: ['users']
    }]);
  };

  const updateChart = (index: number, updates: any) => {
    const updated = [...charts];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeChart = (index: number) => {
    onChange(charts.filter((_, i) => i !== index));
    setSelectedChart(null);
  };

  const addColor = (index: number) => {
    const chart = charts[index];
    updateChart(index, { colors: [...chart.colors, '#000000'] });
  };

  const updateColor = (chartIndex: number, colorIndex: number, color: string) => {
    const chart = charts[chartIndex];
    const colors = [...chart.colors];
    colors[colorIndex] = color;
    updateChart(chartIndex, { colors });
  };

  const addSeries = (index: number) => {
    const chart = charts[index];
    updateChart(index, { series: [...chart.series, 'newSeries'] });
  };

  const updateSeries = (chartIndex: number, seriesIndex: number, value: string) => {
    const chart = charts[chartIndex];
    const series = [...chart.series];
    series[seriesIndex] = value;
    updateChart(chartIndex, { series });
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Chart Configuration</h3>
        <Button onClick={addChart} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Chart
        </Button>
      </div>

      <div className="space-y-4">
        {charts.map((chart, index) => (
          <Card key={chart.id} className="p-4 border-2 border-dashed">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {chart.type === 'bar' && <BarChart3 className="w-4 h-4" />}
                  {chart.type === 'line' && <LineChart className="w-4 h-4" />}
                  {chart.type === 'pie' && <PieChart className="w-4 h-4" />}
                  <Badge>{chart.type}</Badge>
                </div>
                <Button
                  onClick={() => removeChart(index)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Chart Title</Label>
                <Input
                  value={chart.title}
                  onChange={(e) => updateChart(index, { title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Chart Type</Label>
                <Select
                  value={chart.type}
                  onValueChange={(value) => updateChart(index, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Source</Label>
                <Input
                  value={chart.dataSource}
                  onChange={(e) => updateChart(index, { dataSource: e.target.value })}
                  placeholder="e.g., chartData.userGrowth"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Colors</Label>
                  <Button onClick={() => addColor(index)} size="sm" variant="outline">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {chart.colors.map((color: string, colorIndex: number) => (
                    <Input
                      key={colorIndex}
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(index, colorIndex, e.target.value)}
                      className="w-16 h-10"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Data Series</Label>
                  <Button onClick={() => addSeries(index)} size="sm" variant="outline">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {chart.series.map((series: string, seriesIndex: number) => (
                    <Input
                      key={seriesIndex}
                      value={series}
                      onChange={(e) => updateSeries(index, seriesIndex, e.target.value)}
                      placeholder="e.g., users, sessions"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {charts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No charts configured. Click "Add Chart" to get started.
          </div>
        )}
      </div>
    </Card>
  );
}
