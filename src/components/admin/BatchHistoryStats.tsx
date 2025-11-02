import { Card, CardContent } from '@/components/ui/card';
import { FileText, Zap, TrendingUp, Clock } from 'lucide-react';

interface BatchHistoryStatsProps {
  stats: {
    totalBatches: number;
    totalOperations: number;
    avgBatchSize: string;
    avgTypingSpeed: string;
  } | null;
}

export function BatchHistoryStats({ stats }: BatchHistoryStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Batches</p>
              <p className="text-2xl font-bold">{stats.totalBatches}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Operations</p>
              <p className="text-2xl font-bold">{stats.totalOperations}</p>
            </div>
            <Zap className="h-8 w-8 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Batch Size</p>
              <p className="text-2xl font-bold">{stats.avgBatchSize}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Typing Speed</p>
              <p className="text-2xl font-bold">{stats.avgTypingSpeed} <span className="text-sm">ops/min</span></p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
