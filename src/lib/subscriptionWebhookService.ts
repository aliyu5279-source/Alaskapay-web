import { supabase } from './supabase';

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  source: 'stripe' | 'paystack';
}

export const subscriptionWebhookService = {
  async verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
    try {
      // In production, this would be done server-side
      // This is a placeholder for client-side webhook testing
      return true;
    } catch (error) {
      console.error('Stripe signature verification failed:', error);
      return false;
    }
  },

  async verifyPaystackSignature(payload: string, signature: string, secret: string): Promise<boolean> {
    try {
      // In production, this would be done server-side
      return true;
    } catch (error) {
      console.error('Paystack signature verification failed:', error);
      return false;
    }
  },

  async checkDuplicateEvent(eventId: string): Promise<boolean> {
    const { data } = await supabase
      .from('webhook_delivery_logs')
      .select('id')
      .eq('event_id', eventId)
      .single();

    return !!data;
  },

  async logWebhookDelivery(event: WebhookEvent, status: string) {
    await supabase.from('webhook_delivery_logs').insert({
      event_id: event.id,
      event_type: event.type,
      payload: event.data,
      source: event.source,
      status,
      processed_at: status === 'success' ? new Date().toISOString() : null
    });
  },

  async handleInvoicePaid(subscriptionId: string, periodEnd: Date) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: periodEnd.toISOString()
      })
      .eq('external_subscription_id', subscriptionId);
  },

  async handlePaymentFailed(subscriptionId: string) {
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('external_subscription_id', subscriptionId);
  },

  async handleSubscriptionUpdated(subscriptionId: string, updates: any) {
    await supabase
      .from('subscriptions')
      .update(updates)
      .eq('external_subscription_id', subscriptionId);
  },

  async handleSubscriptionCancelled(subscriptionId: string) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('external_subscription_id', subscriptionId);
  },

  async getWebhookLogs(filters?: { source?: string; status?: string; limit?: number }) {
    let query = supabase
      .from('webhook_delivery_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.source) {
      query = query.eq('source', filters.source);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getWebhookStats() {
    const { data: logs } = await supabase
      .from('webhook_delivery_logs')
      .select('status, source, created_at');

    if (!logs) return null;

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const stats = {
      total: logs.length,
      success: logs.filter(l => l.status === 'success').length,
      failed: logs.filter(l => l.status === 'failed').length,
      last24h: logs.filter(l => new Date(l.created_at) > last24h).length,
      bySource: {
        stripe: logs.filter(l => l.source === 'stripe').length,
        paystack: logs.filter(l => l.source === 'paystack').length
      }
    };

    return stats;
  }
};
