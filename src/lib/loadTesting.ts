import { supabase } from './supabase';

export interface LoadTestConfig {
  name: string;
  description?: string;
  testType: 'wallet' | 'payment' | 'api' | 'full';
  virtualUsers: number;
  durationSeconds: number;
  rampUpSeconds?: number;
}

export interface LoadTestMetric {
  metricType: string;
  endpoint?: string;
  value: number;
  unit: string;
  metadata?: Record<string, any>;
}

export interface LoadTestReport {
  summary: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    maxResponseTime: number;
    throughput: number;
    errorRate: number;
  };
  bottlenecks: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedEndpoints: string[];
  }>;
  recommendations: Array<{
    category: string;
    priority: 'low' | 'medium' | 'high';
    recommendation: string;
    expectedImpact: string;
  }>;
  performanceScore: number;
}

export const loadTestingService = {
  async createTestRun(config: LoadTestConfig) {
    const { data, error } = await supabase
      .from('load_test_runs')
      .insert({
        name: config.name,
        description: config.description,
        test_type: config.testType,
        virtual_users: config.virtualUsers,
        duration_seconds: config.durationSeconds,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async startTest(testRunId: string) {
    const { error } = await supabase
      .from('load_test_runs')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', testRunId);

    if (error) throw error;
  },

  async recordMetric(testRunId: string, metric: LoadTestMetric) {
    const { error } = await supabase
      .from('load_test_metrics')
      .insert({
        test_run_id: testRunId,
        metric_type: metric.metricType,
        endpoint: metric.endpoint,
        value: metric.value,
        unit: metric.unit,
        metadata: metric.metadata,
      });

    if (error) throw error;
  },

  async completeTest(testRunId: string, report: LoadTestReport) {
    const { error: updateError } = await supabase
      .from('load_test_runs')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', testRunId);

    if (updateError) throw updateError;

    const { error: reportError } = await supabase
      .from('load_test_reports')
      .insert({
        test_run_id: testRunId,
        summary: report.summary,
        bottlenecks: report.bottlenecks,
        recommendations: report.recommendations,
        performance_score: report.performanceScore,
      });

    if (reportError) throw reportError;
  },
};
