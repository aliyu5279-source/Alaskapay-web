import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SubscriptionAnalytics {
  mrr: number;
  activeSubscriptions: number;
  churnRate: number;
  avgCLV: number;
  mrrTrend: any[];
  churnData: any[];
  planDistribution: any[];
  forecast: any[];
  cohorts: any[];
}

export function useSubscriptionAnalytics(timeRange: string = '30d') {
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('get-subscription-analytics', {
        body: { timeRange, metrics: 'all' }
      });

      if (fetchError) throw fetchError;
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      const { data, error } = await supabase.functions.invoke('export-analytics-data', {
        body: { type: 'subscription', format, timeRange }
      });

      if (error) throw error;
      
      // Create download link
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscription-analytics-${Date.now()}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { analytics, loading, error, refetch: fetchAnalytics, exportAnalytics };
}
