import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';

export interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
  compareRevenue?: number;
  compareTransactions?: number;
}

interface UseRevenueDataOptions {
  startDate: Date;
  endDate: Date;
  compareEnabled?: boolean;
  paymentTypes?: string[];
}

export function useRevenueData({ startDate, endDate, compareEnabled, paymentTypes }: UseRevenueDataOptions) {
  return useQuery({
    queryKey: ['revenue-data', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), compareEnabled, paymentTypes],
    queryFn: async () => {
      let query = supabase
        .from('daily_revenue_stats')
        .select('date, total_revenue, transaction_count, payment_type')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (paymentTypes && paymentTypes.length > 0 && !paymentTypes.includes('all')) {
        query = query.in('payment_type', paymentTypes);
      }

      const { data, error } = await query;
      if (error) throw error;

      let compareData = null;
      if (compareEnabled) {
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const compareStart = subDays(startDate, daysDiff);
        const compareEnd = subDays(endDate, daysDiff);

        let compareQuery = supabase
          .from('daily_revenue_stats')
          .select('date, total_revenue, transaction_count')
          .gte('date', format(compareStart, 'yyyy-MM-dd'))
          .lte('date', format(compareEnd, 'yyyy-MM-dd'))
          .order('date', { ascending: true });

        if (paymentTypes && paymentTypes.length > 0 && !paymentTypes.includes('all')) {
          compareQuery = compareQuery.in('payment_type', paymentTypes);
        }

        const { data: cData } = await compareQuery;
        compareData = cData;
      }

      return (data || []).map((row, index) => ({
        date: format(new Date(row.date), 'MMM dd'),
        revenue: row.total_revenue || 0,
        transactions: row.transaction_count || 0,
        compareRevenue: compareData?.[index]?.total_revenue || undefined,
        compareTransactions: compareData?.[index]?.transaction_count || undefined,
      }));
    },
    refetchInterval: 60000,
  });
}

export function useRevenueStats(paymentTypes?: string[]) {
  return useQuery({
    queryKey: ['revenue-stats', paymentTypes],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      let todayQuery = supabase
        .from('daily_revenue_stats')
        .select('total_revenue, transaction_count, avg_transaction_value')
        .eq('date', today);

      let yesterdayQuery = supabase
        .from('daily_revenue_stats')
        .select('total_revenue')
        .eq('date', yesterday);

      if (paymentTypes && paymentTypes.length > 0 && !paymentTypes.includes('all')) {
        todayQuery = todayQuery.in('payment_type', paymentTypes);
        yesterdayQuery = yesterdayQuery.in('payment_type', paymentTypes);
      }

      const { data: todayData } = await todayQuery.single();
      const { data: yesterdayData } = await yesterdayQuery.single();

      const totalRevenue = todayData?.total_revenue || 0;
      const yesterdayRevenue = yesterdayData?.total_revenue || 0;
      const percentChange = yesterdayRevenue > 0 
        ? ((totalRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
        : '0';

      return {
        totalRevenue,
        transactionCount: todayData?.transaction_count || 0,
        avgTransactionValue: todayData?.avg_transaction_value || 0,
        percentChange: `${percentChange}%`,
      };
    },
    refetchInterval: 60000,
  });
}
