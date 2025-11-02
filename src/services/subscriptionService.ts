import { supabase } from '../lib/supabase';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'paused' | 'past_due';
  current_period_end: string;
  cancel_at_period_end?: boolean;
  paused_until?: string | null;
}

export class SubscriptionService {
  static async getPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('price', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async subscribe(
    userId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<Subscription> {
    // Check for existing subscription
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (existing) {
      throw new Error('User already has an active subscription');
    }

    const { data, error } = await supabase.rpc('create_subscription', {
      p_user_id: userId,
      p_plan_id: planId,
      p_payment_method_id: paymentMethodId,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async cancel(
    subscriptionId: string,
    immediate: boolean = false
  ): Promise<Subscription> {
    const { data, error } = await supabase.rpc('cancel_subscription', {
      p_subscription_id: subscriptionId,
      p_immediate: immediate,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async pause(
    subscriptionId: string,
    resumeDate: string
  ): Promise<Subscription> {
    const { data, error } = await supabase.rpc('pause_subscription', {
      p_subscription_id: subscriptionId,
      p_resume_date: resumeDate,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async resume(subscriptionId: string): Promise<Subscription> {
    const { data, error } = await supabase.rpc('resume_subscription', {
      p_subscription_id: subscriptionId,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async upgrade(
    subscriptionId: string,
    newPlanId: string,
    prorate: boolean = true
  ): Promise<Subscription> {
    const { data, error } = await supabase.rpc('upgrade_subscription', {
      p_subscription_id: subscriptionId,
      p_new_plan_id: newPlanId,
      p_prorate: prorate,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getUsage(subscriptionId: string): Promise<any> {
    const { data, error } = await supabase
      .from('subscription_usage')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .gte('period_start', new Date().toISOString().slice(0, 7) + '-01')
      .lte('period_end', new Date().toISOString().slice(0, 10))
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}