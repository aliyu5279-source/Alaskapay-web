import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';

export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
  compareNewUsers?: number;
  compareTotalUsers?: number;
}

interface UseUserGrowthOptions {
  startDate: Date;
  endDate: Date;
  compareEnabled?: boolean;
  userSegments?: string[];
}

export function useUserGrowth({ startDate, endDate, compareEnabled, userSegments }: UseUserGrowthOptions) {
  return useQuery({
    queryKey: ['user-growth', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), compareEnabled, userSegments],
    queryFn: async () => {
      let query = supabase
        .from('daily_user_stats')
        .select('date, new_users, total_users, user_segment')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (userSegments && userSegments.length > 0 && !userSegments.includes('all')) {
        query = query.in('user_segment', userSegments);
      }

      const { data, error } = await query;
      if (error) throw error;

      let compareData = null;
      if (compareEnabled) {
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const compareStart = subDays(startDate, daysDiff);
        const compareEnd = subDays(endDate, daysDiff);

        let compareQuery = supabase
          .from('daily_user_stats')
          .select('date, new_users, total_users')
          .gte('date', format(compareStart, 'yyyy-MM-dd'))
          .lte('date', format(compareEnd, 'yyyy-MM-dd'))
          .order('date', { ascending: true });

        if (userSegments && userSegments.length > 0 && !userSegments.includes('all')) {
          compareQuery = compareQuery.in('user_segment', userSegments);
        }

        const { data: cData } = await compareQuery;
        compareData = cData;
      }

      return (data || []).map((row, index) => ({
        date: format(new Date(row.date), 'MMM dd'),
        newUsers: row.new_users || 0,
        totalUsers: row.total_users || 0,
        compareNewUsers: compareData?.[index]?.new_users || undefined,
        compareTotalUsers: compareData?.[index]?.total_users || undefined,
      }));
    },
    refetchInterval: 60000,
  });
}

export function useUserStats(userSegments?: string[]) {
  return useQuery({
    queryKey: ['user-stats', userSegments],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      let todayQuery = supabase
        .from('daily_user_stats')
        .select('new_users, total_users')
        .eq('date', today);

      let yesterdayQuery = supabase
        .from('daily_user_stats')
        .select('new_users')
        .eq('date', yesterday);

      if (userSegments && userSegments.length > 0 && !userSegments.includes('all')) {
        todayQuery = todayQuery.in('user_segment', userSegments);
        yesterdayQuery = yesterdayQuery.in('user_segment', userSegments);
      }

      const { data: todayData } = await todayQuery.single();
      const { data: yesterdayData } = await yesterdayQuery.single();

      const totalUsers = todayData?.total_users || 0;
      const newUsersToday = todayData?.new_users || 0;
      const newUsersYesterday = yesterdayData?.new_users || 0;
      const percentChange = newUsersYesterday > 0 
        ? ((newUsersToday - newUsersYesterday) / newUsersYesterday * 100).toFixed(1)
        : '0';

      return {
        totalUsers,
        newUsersToday,
        newUsersYesterday,
        percentChange: `${percentChange}%`,
      };
    },
    refetchInterval: 60000,
  });
}
