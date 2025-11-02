import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';

export interface PaymentStatsData {
  type: string;
  count: number;
  amount: number;
  compareCount?: number;
  compareAmount?: number;
}

interface UsePaymentStatsOptions {
  startDate: Date;
  endDate: Date;
  compareEnabled?: boolean;
  paymentTypes?: string[];
}

export function usePaymentStats({ startDate, endDate, compareEnabled, paymentTypes }: UsePaymentStatsOptions) {
  return useQuery({
    queryKey: ['payment-stats', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), compareEnabled, paymentTypes],
    queryFn: async () => {
      let query = supabase
        .from('daily_payment_stats')
        .select('date, payment_type, transaction_count, total_amount')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'));

      if (paymentTypes && paymentTypes.length > 0 && !paymentTypes.includes('all')) {
        query = query.in('payment_type', paymentTypes);
      }

      const { data, error } = await query;
      if (error) throw error;

      const aggregated = (data || []).reduce((acc, row) => {
        const type = row.payment_type || 'unknown';
        if (!acc[type]) {
          acc[type] = { count: 0, amount: 0 };
        }
        acc[type].count += row.transaction_count || 0;
        acc[type].amount += row.total_amount || 0;
        return acc;
      }, {} as Record<string, { count: number; amount: number }>);

      let compareAggregated = null;
      if (compareEnabled) {
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const compareStart = subDays(startDate, daysDiff);
        const compareEnd = subDays(endDate, daysDiff);

        let compareQuery = supabase
          .from('daily_payment_stats')
          .select('payment_type, transaction_count, total_amount')
          .gte('date', format(compareStart, 'yyyy-MM-dd'))
          .lte('date', format(compareEnd, 'yyyy-MM-dd'));

        if (paymentTypes && paymentTypes.length > 0 && !paymentTypes.includes('all')) {
          compareQuery = compareQuery.in('payment_type', paymentTypes);
        }

        const { data: cData } = await compareQuery;
        compareAggregated = (cData || []).reduce((acc, row) => {
          const type = row.payment_type || 'unknown';
          if (!acc[type]) {
            acc[type] = { count: 0, amount: 0 };
          }
          acc[type].count += row.transaction_count || 0;
          acc[type].amount += row.total_amount || 0;
          return acc;
        }, {} as Record<string, { count: number; amount: number }>);
      }

      return Object.entries(aggregated).map(([type, stats]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: stats.count,
        amount: stats.amount,
        compareCount: compareAggregated?.[type]?.count || undefined,
        compareAmount: compareAggregated?.[type]?.amount || undefined,
      }));
    },
    refetchInterval: 60000,
  });
}
