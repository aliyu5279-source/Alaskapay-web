import { supabase } from './supabase';

export interface RateLimitConfig {
  enabled: boolean;
  maxRequestsPerMinute: number;
  burstLimit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  resetAt: Date;
  throttled: boolean;
}

export async function checkRateLimit(
  webhookId: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (!config.enabled) {
    return {
      allowed: true,
      currentCount: 0,
      limit: config.maxRequestsPerMinute,
      resetAt: new Date(),
      throttled: false,
    };
  }

  const windowStart = new Date();
  windowStart.setSeconds(windowStart.getSeconds() - config.windowSeconds);

  // Get or create tracking record
  const { data: tracking, error } = await supabase
    .from('webhook_rate_limit_tracking')
    .select('*')
    .eq('webhook_id', webhookId)
    .gte('window_start', windowStart.toISOString())
    .single();

  let currentCount = tracking?.request_count || 0;

  // Check if limit exceeded
  if (currentCount >= config.maxRequestsPerMinute) {
    // Update throttled count
    if (tracking) {
      await supabase
        .from('webhook_rate_limit_tracking')
        .update({ 
          throttled_count: (tracking.throttled_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', tracking.id);
    }

    const resetAt = new Date(tracking?.window_start || new Date());
    resetAt.setSeconds(resetAt.getSeconds() + config.windowSeconds);

    return {
      allowed: false,
      currentCount,
      limit: config.maxRequestsPerMinute,
      resetAt,
      throttled: true,
    };
  }

  // Increment counter
  if (tracking) {
    await supabase
      .from('webhook_rate_limit_tracking')
      .update({ 
        request_count: currentCount + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', tracking.id);
  } else {
    await supabase
      .from('webhook_rate_limit_tracking')
      .insert({
        webhook_id: webhookId,
        window_start: new Date().toISOString(),
        request_count: 1,
        throttled_count: 0,
      });
  }

  return {
    allowed: true,
    currentCount: currentCount + 1,
    limit: config.maxRequestsPerMinute,
    resetAt: new Date(Date.now() + config.windowSeconds * 1000),
    throttled: false,
  };
}

export async function queueWebhook(
  webhookId: string,
  eventType: string,
  payload: any,
  delaySeconds: number = 60
) {
  const scheduledFor = new Date();
  scheduledFor.setSeconds(scheduledFor.getSeconds() + delaySeconds);

  await supabase.from('webhook_queue').insert({
    webhook_id: webhookId,
    event_type: eventType,
    payload,
    scheduled_for: scheduledFor.toISOString(),
    status: 'queued',
  });
}
