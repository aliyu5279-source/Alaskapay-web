interface BatchHistoryItem {
  id: string;
  timestamp: number;
  duration: number;
  operationCount: number;
  preview: string;
  fieldType?: string;
}

export const exportBatchHistoryToCSV = (batches: BatchHistoryItem[], includeAnalytics: boolean = false): string => {
  const headers = ['Timestamp', 'Duration (ms)', 'Operations', 'Field Type', 'Preview'];
  const rows = batches.map(b => [
    new Date(b.timestamp).toISOString(),
    b.duration.toString(),
    b.operationCount.toString(),
    b.fieldType || 'N/A',
    `"${b.preview.replace(/"/g, '""')}"`
  ]);
  
  let csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  if (includeAnalytics) {
    const metrics = calculateProductivityMetrics(batches);
    if (metrics) {
      csv += `\n\nANALYTICS\n`;
      csv += `Total Batches,${metrics.totalBatches}\n`;
      csv += `Total Operations,${metrics.totalOperations}\n`;
      csv += `Avg Batch Size,${metrics.avgBatchSize}\n`;
      csv += `Ops Per Minute,${metrics.opsPerMinute}\n`;
      csv += `Peak Hour,${metrics.peakHour}\n`;
    }
  }
  
  return csv;
};

export const exportBatchHistoryToJSON = (batches: BatchHistoryItem[], includeAnalytics: boolean = false): string => {
  const data: any = { batches };
  
  if (includeAnalytics) {
    data.analytics = calculateProductivityMetrics(batches);
  }
  
  return JSON.stringify(data, null, 2);
};

// Legacy exports for backward compatibility
export const generateCSV = (batches: BatchHistoryItem[]): string => exportBatchHistoryToCSV(batches, false);
export const generateJSON = (batches: BatchHistoryItem[]): string => exportBatchHistoryToJSON(batches, false);


export const calculateProductivityMetrics = (batches: BatchHistoryItem[]) => {
  if (batches.length === 0) return null;

  const totalOps = batches.reduce((sum, b) => sum + b.operationCount, 0);
  const totalDuration = batches.reduce((sum, b) => sum + b.duration, 0);
  const avgBatchSize = totalOps / batches.length;
  const opsPerMinute = (totalOps / totalDuration) * 60000;

  // Peak activity times (by hour)
  const hourCounts: Record<number, number> = {};
  batches.forEach(b => {
    const hour = new Date(b.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + b.operationCount;
  });
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

  // Editing patterns
  const fieldTypeCounts: Record<string, number> = {};
  batches.forEach(b => {
    const type = b.fieldType || 'unknown';
    fieldTypeCounts[type] = (fieldTypeCounts[type] || 0) + 1;
  });

  return {
    totalBatches: batches.length,
    totalOperations: totalOps,
    avgBatchSize: Math.round(avgBatchSize * 10) / 10,
    opsPerMinute: Math.round(opsPerMinute * 10) / 10,
    peakHour: peakHour ? `${peakHour[0]}:00 (${peakHour[1]} ops)` : 'N/A',
    fieldTypeDistribution: fieldTypeCounts
  };
};

export const generateAnalyticsReport = (batches: BatchHistoryItem[]): string => {
  const metrics = calculateProductivityMetrics(batches);
  if (!metrics) return 'No data available';

  return `BATCH HISTORY ANALYTICS REPORT
Generated: ${new Date().toISOString()}

SUMMARY STATISTICS
==================
Total Batches: ${metrics.totalBatches}
Total Operations: ${metrics.totalOperations}
Average Batch Size: ${metrics.avgBatchSize} operations
Operations Per Minute: ${metrics.opsPerMinute}
Peak Activity Time: ${metrics.peakHour}

FIELD TYPE DISTRIBUTION
=======================
${Object.entries(metrics.fieldTypeDistribution).map(([type, count]) => `${type}: ${count} batches`).join('\n')}
`;
};
