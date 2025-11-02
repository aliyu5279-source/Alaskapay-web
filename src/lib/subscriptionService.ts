import { supabase } from './supabase';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: 'daily' | 'weekly' | 'monthly' | 'yearly';
  features: string[];
  usage_limits?: {
    transactions?: number;
    transfers?: number;
    api_calls?: number;
  };
  paystack_plan_code?: string;
  active: boolean;
}

export interface CreateSubscriptionParams {
  user_id: string;
  plan_id: string;
  payment_method_id: string;
  authorization_code?: string;
  trial_days?: number;
}

export interface PauseSubscriptionParams {
  subscription_id: string;
  pause_reason?: string;
  resume_at?: string;
  max_pause_days?: number;
}

export const subscriptionService = {
  async createSubscription(params: CreateSubscriptionParams) {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: params
    });
    if (error) throw error;
    return data;
  },

  async pauseSubscription(params: PauseSubscriptionParams) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'paused',
        paused_at: new Date().toISOString(),
        resume_at: params.resume_at || new Date(Date.now() + 30 * 86400000).toISOString(),
        pause_reason: params.pause_reason
      })
      .eq('id', params.subscription_id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async resumeSubscription(params: { subscription_id: string; immediate?: boolean }) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        paused_at: null,
        resume_at: null,
        pause_reason: null
      })
      .eq('id', params.subscription_id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async upgradeSubscription(subscriptionId: string, newPlanId: string, prorate = true) {
    const { data, error } = await supabase.functions.invoke('handle-subscription-upgrade', {
      body: { subscription_id: subscriptionId, new_plan_id: newPlanId, prorate }
    });
    if (error) throw error;
    return data;
  },

  async trackUsage(subscriptionId: string, metric: string, quantity: number) {
    const { data, error } = await supabase
      .from('subscription_usage')
      .insert({
        subscription_id: subscriptionId,
        metric,
        quantity,
        timestamp: new Date().toISOString()
      });
    
    if (error) throw error;
    return data;
  }
};
