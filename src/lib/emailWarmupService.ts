import { supabase } from './supabase';

export interface WarmupSchedule {
  id: string;
  domain_id: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  start_date: string;
  current_day: number;
  daily_limit: number;
  target_daily_limit: number;
  increase_percentage: number;
  increase_interval_days: number;
  last_increase_date: string;
  completion_date?: string;
}

export interface WarmupDailyStats {
  date: string;
  emails_sent: number;
  emails_delivered: number;
  emails_bounced: number;
  emails_complained: number;
  bounce_rate: number;
  complaint_rate: number;
  daily_limit: number;
  limit_reached: boolean;
  throttled: boolean;
}

export const emailWarmupService = {
  // Create warmup schedule for new domain
  async createWarmupSchedule(domainId: string, config?: Partial<WarmupSchedule>) {
    const { data, error } = await supabase
      .from('email_warmup_schedules')
      .insert({
        domain_id: domainId,
        daily_limit: config?.daily_limit || 100,
        target_daily_limit: config?.target_daily_limit || 10000,
        increase_percentage: config?.increase_percentage || 50,
        increase_interval_days: config?.increase_interval_days || 3,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Check if domain can send email
  async canSendEmail(domainId: string): Promise<{ allowed: boolean; reason?: string; remainingToday?: number }> {
    const { data: schedule } = await supabase
      .from('email_warmup_schedules')
      .select('*')
      .eq('domain_id', domainId)
      .eq('status', 'active')
      .single();

    if (!schedule) {
      return { allowed: true }; // No warmup schedule, allow sending
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: stats } = await supabase
      .from('email_warmup_daily_stats')
      .select('*')
      .eq('schedule_id', schedule.id)
      .eq('date', today)
      .single();

    if (!stats) {
      return { allowed: true, remainingToday: schedule.daily_limit };
    }

    if (stats.throttled) {
      return { allowed: false, reason: 'Domain is throttled due to high bounce/complaint rates' };
    }

    if (stats.emails_sent >= stats.daily_limit) {
      return { allowed: false, reason: 'Daily warmup limit reached', remainingToday: 0 };
    }

    return { allowed: true, remainingToday: stats.daily_limit - stats.emails_sent };
  },

  // Record email sent during warmup
  async recordEmailSent(domainId: string, delivered: boolean, bounced: boolean, complained: boolean) {
    const { data: schedule } = await supabase
      .from('email_warmup_schedules')
      .select('*')
      .eq('domain_id', domainId)
      .eq('status', 'active')
      .single();

    if (!schedule) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabase
      .from('email_warmup_daily_stats')
      .select('*')
      .eq('schedule_id', schedule.id)
      .eq('date', today)
      .single();

    if (existing) {
      await supabase
        .from('email_warmup_daily_stats')
        .update({
          emails_sent: existing.emails_sent + 1,
          emails_delivered: existing.emails_delivered + (delivered ? 1 : 0),
          emails_bounced: existing.emails_bounced + (bounced ? 1 : 0),
          emails_complained: existing.emails_complained + (complained ? 1 : 0),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('email_warmup_daily_stats')
        .insert({
          schedule_id: schedule.id,
          date: today,
          emails_sent: 1,
          emails_delivered: delivered ? 1 : 0,
          emails_bounced: bounced ? 1 : 0,
          emails_complained: complained ? 1 : 0,
          daily_limit: schedule.daily_limit,
        });
    }
  },

  // Get warmup progress
  async getWarmupProgress(domainId: string) {
    const { data: schedule } = await supabase
      .from('email_warmup_schedules')
      .select('*')
      .eq('domain_id', domainId)
      .single();

    if (!schedule) return null;

    const { data: stats } = await supabase
      .from('email_warmup_daily_stats')
      .select('*')
      .eq('schedule_id', schedule.id)
      .order('date', { ascending: false })
      .limit(30);

    const { data: milestones } = await supabase
      .from('email_warmup_milestones')
      .select('*')
      .eq('schedule_id', schedule.id)
      .order('achieved_at', { ascending: false });

    return { schedule, stats: stats || [], milestones: milestones || [] };
  },
};
