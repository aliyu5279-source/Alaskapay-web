import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';

export interface EmailEngagementData {
  date: string;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  compareSent?: number;
  compareOpened?: number;
  compareClicked?: number;
  compareBounced?: number;
}

interface UseEmailEngagementOptions {
  startDate: Date;
  endDate: Date;
  compareEnabled?: boolean;
  emailCampaigns?: string[];
}

export function useEmailEngagement({ startDate, endDate, compareEnabled, emailCampaigns }: UseEmailEngagementOptions) {
  return useQuery({
    queryKey: ['email-engagement', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), compareEnabled, emailCampaigns],
    queryFn: async () => {
      let query = supabase
        .from('daily_email_stats')
        .select('date, emails_sent, emails_opened, emails_clicked, emails_bounced, campaign_type')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (emailCampaigns && emailCampaigns.length > 0 && !emailCampaigns.includes('all')) {
        query = query.in('campaign_type', emailCampaigns);
      }

      const { data, error } = await query;
      if (error) throw error;

      let compareData = null;
      if (compareEnabled) {
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const compareStart = subDays(startDate, daysDiff);
        const compareEnd = subDays(endDate, daysDiff);

        let compareQuery = supabase
          .from('daily_email_stats')
          .select('date, emails_sent, emails_opened, emails_clicked, emails_bounced')
          .gte('date', format(compareStart, 'yyyy-MM-dd'))
          .lte('date', format(compareEnd, 'yyyy-MM-dd'))
          .order('date', { ascending: true });

        if (emailCampaigns && emailCampaigns.length > 0 && !emailCampaigns.includes('all')) {
          compareQuery = compareQuery.in('campaign_type', emailCampaigns);
        }

        const { data: cData } = await compareQuery;
        compareData = cData;
      }

      return (data || []).map((row, index) => ({
        date: format(new Date(row.date), 'MMM dd'),
        sent: row.emails_sent || 0,
        opened: row.emails_opened || 0,
        clicked: row.emails_clicked || 0,
        bounced: row.emails_bounced || 0,
        compareSent: compareData?.[index]?.emails_sent || undefined,
        compareOpened: compareData?.[index]?.emails_opened || undefined,
        compareClicked: compareData?.[index]?.emails_clicked || undefined,
        compareBounced: compareData?.[index]?.emails_bounced || undefined,
      }));
    },
    refetchInterval: 60000,
  });
}

export function useEmailStats(emailCampaigns?: string[]) {
  return useQuery({
    queryKey: ['email-stats', emailCampaigns],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      let todayQuery = supabase
        .from('daily_email_stats')
        .select('emails_sent, emails_opened, emails_clicked, open_rate')
        .eq('date', today);

      let yesterdayQuery = supabase
        .from('daily_email_stats')
        .select('open_rate')
        .eq('date', yesterday);

      if (emailCampaigns && emailCampaigns.length > 0 && !emailCampaigns.includes('all')) {
        todayQuery = todayQuery.in('campaign_type', emailCampaigns);
        yesterdayQuery = yesterdayQuery.in('campaign_type', emailCampaigns);
      }

      const { data: todayData } = await todayQuery.single();
      const { data: yesterdayData } = await yesterdayQuery.single();

      const openRate = todayData?.open_rate || 0;
      const yesterdayOpenRate = yesterdayData?.open_rate || 0;
      const percentChange = yesterdayOpenRate > 0 
        ? ((openRate - yesterdayOpenRate) / yesterdayOpenRate * 100).toFixed(1)
        : '0';

      return {
        emailsSent: todayData?.emails_sent || 0,
        emailsOpened: todayData?.emails_opened || 0,
        emailsClicked: todayData?.emails_clicked || 0,
        openRate: `${openRate}%`,
        percentChange: `${percentChange}%`,
      };
    },
    refetchInterval: 60000,
  });
}
