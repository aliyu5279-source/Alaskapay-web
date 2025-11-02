import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, FileText } from 'lucide-react';
import { BatchHistoryEntry } from '@/hooks/useUndoRedo';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BatchHistoryStats } from './BatchHistoryStats';
import { BatchHistoryExport } from './BatchHistoryExport';

interface BatchHistoryPanelProps {
  batchHistory: BatchHistoryEntry[];
}

export function BatchHistoryPanel({ batchHistory }: BatchHistoryPanelProps) {
  const [selectedBatch, setSelectedBatch] = useState<BatchHistoryEntry | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    if (batchHistory.length === 0) return null;

    const totalOps = batchHistory.reduce((sum, b) => sum + b.operationCount, 0);
    const avgBatchSize = totalOps / batchHistory.length;
    const totalDuration = batchHistory.reduce((sum, b) => sum + b.duration, 0);
    const avgTypingSpeed = totalDuration > 0 ? (totalOps / (totalDuration / 1000)) * 60 : 0;

    return {
      totalBatches: batchHistory.length,
      totalOperations: totalOps,
      avgBatchSize: avgBatchSize.toFixed(1),
      avgTypingSpeed: avgTypingSpeed.toFixed(0)
    };
  }, [batchHistory]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return batchHistory.slice(-20).map((batch, idx) => ({
      name: `B${idx + 1}`,
      operations: batch.operationCount,
      timestamp: batch.timestamp
    }));
  }, [batchHistory]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Transform batch history to match export format
  const exportBatches = useMemo(() => {
    return batchHistory.map(b => ({
      id: b.id,
      timestamp: b.timestamp,
      duration: b.duration,
      operationCount: b.operationCount,
      preview: b.preview,
      fieldType: b.field
    }));
  }, [batchHistory]);

  return (
    <div className="space-y-4">
      <BatchHistoryStats stats={stats} />

      {/* Export Section */}
      <BatchHistoryExport batches={exportBatches} />


      {/* Batch Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Frequency Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="operations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Batch Timeline */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Batch Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {batchHistory.slice().reverse().map((batch) => (
                  <Button
                    key={batch.id}
                    variant={selectedBatch?.id === batch.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedBatch(batch)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{formatTime(batch.timestamp)}</span>
                        <Badge variant="secondary">{batch.operationCount} ops</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{batch.preview}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Batch Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Batch Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBatch ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedBatch.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Field</label>
                  <p className="text-sm text-muted-foreground">{selectedBatch.field}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Operations</label>
                  <p className="text-sm text-muted-foreground">{selectedBatch.operationCount} operations</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <p className="text-sm text-muted-foreground">{formatDuration(selectedBatch.duration)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Preview</label>
                  <p className="text-sm text-muted-foreground break-words">{selectedBatch.preview}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a batch to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
