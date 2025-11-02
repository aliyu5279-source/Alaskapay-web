import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { subscriptionService } from '@/lib/subscriptionService';

export function useSubscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    fetchSubscription();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('subscription-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${subscription?.user_id}`
      }, () => {
        fetchSubscription();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', user.id)
        .in('status', ['active', 'paused', 'past_due'])
        .single();

      setSubscription(data);
      
      if (data) {
        await fetchUsage(data.id);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsage = async (subscriptionId: string) => {
    const periodStart = new Date();
    periodStart.setDate(1);

    const { data } = await supabase
      .from('subscription_usage')
      .select('metric, quantity')
      .eq('subscription_id', subscriptionId)
      .gte('timestamp', periodStart.toISOString());

    if (data) {
      const aggregated = data.reduce((acc: any, item: any) => {
        acc[item.metric] = (acc[item.metric] || 0) + item.quantity;
        return acc;
      }, {});
      setUsage(aggregated);
    }
  };

  const trackUsage = async (metric: string, quantity = 1) => {
    if (!subscription) return;
    
    try {
      await subscriptionService.trackUsage(subscription.id, metric, quantity);
      await fetchUsage(subscription.id);
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  const pause = async (reason?: string, resumeAt?: string) => {
    if (!subscription) return;
    
    try {
      await subscriptionService.pauseSubscription({
        subscription_id: subscription.id,
        pause_reason: reason,
        resume_at: resumeAt
      });
      await fetchSubscription();
    } catch (error) {
      throw error;
    }
  };

  const resume = async () => {
    if (!subscription) return;
    
    try {
      await subscriptionService.resumeSubscription({
        subscription_id: subscription.id,
        immediate: true
      });
      await fetchSubscription();
    } catch (error) {
      throw error;
    }
  };

  const upgrade = async (newPlanId: string) => {
    if (!subscription) return;
    
    try {
      await subscriptionService.upgradeSubscription(subscription.id, newPlanId, true);
      await fetchSubscription();
    } catch (error) {
      throw error;
    }
  };

  return {
    subscription,
    usage,
    loading,
    trackUsage,
    pause,
    resume,
    upgrade,
    refresh: fetchSubscription
  };
}
