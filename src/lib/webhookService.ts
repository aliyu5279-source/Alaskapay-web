import { supabase } from './supabase';
import { checkRateLimit, queueWebhook } from './webhookRateLimiter';


export interface WebhookEvent {
  type: string;
  data: any;
}

export async function triggerWebhook(eventType: string, eventData: any) {
  try {
    // Get all active webhooks for this event type
    const { data: webhooks, error } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('is_active', true)
      .contains('event_types', [eventType]);

    if (error) {
      console.error('Error fetching webhooks:', error);
      return;
    }

    if (!webhooks || webhooks.length === 0) {
      return;
    }

    // Trigger delivery for each webhook
    for (const webhook of webhooks) {
      await deliverWebhook(webhook.id, eventType, eventData);
    }
  } catch (error) {
    console.error('Error triggering webhooks:', error);
  }
}

async function deliverWebhook(webhookId: string, eventType: string, eventData: any) {
  try {
    const { data: webhook } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('id', webhookId)
      .single();

    if (!webhook) return;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(webhookId, {
      enabled: webhook.rate_limit_enabled,
      maxRequestsPerMinute: webhook.max_requests_per_minute,
      burstLimit: webhook.burst_limit,
      windowSeconds: webhook.rate_limit_window_seconds,
    });

    // If rate limited, queue for later delivery
    if (!rateLimitResult.allowed) {
      await queueWebhook(webhookId, eventType, eventData, 60);
      console.log(`Webhook ${webhookId} rate limited, queued for later delivery`);
      return;
    }

    let payload = eventData;
    
    // Format payload based on template type
    if (webhook.template_type === 'slack') {
      payload = {
        text: `🚨 ${eventType.replace(/_/g, ' ').toUpperCase()}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Event:* ${eventType}\n*Time:* ${new Date().toISOString()}`
            }
          }
        ]
      };
    } else if (webhook.template_type === 'discord') {
      payload = {
        content: `🚨 **${eventType.replace(/_/g, ' ').toUpperCase()}**`,
        embeds: [{
          title: eventType,
          description: JSON.stringify(eventData, null, 2).substring(0, 2000),
          color: 15158332,
          timestamp: new Date().toISOString()
        }]
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AlaskaPay-Webhook/1.0',
      ...webhook.headers
    };

    if (webhook.authentication_type === 'api_key') {
      headers['X-API-Key'] = webhook.authentication_secret;
    } else if (webhook.authentication_type === 'bearer_token') {
      headers['Authorization'] = `Bearer ${webhook.authentication_secret}`;
    }

    const startTime = Date.now();
    let deliveryStatus = 'failed';
    let responseStatus = 0;
    let responseBody = '';
    let errorMessage = '';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), webhook.timeout_seconds * 1000);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);
      responseStatus = response.status;
      responseBody = await response.text();
      
      if (response.ok) {
        deliveryStatus = 'success';
      } else {
        errorMessage = `HTTP ${responseStatus}`;
      }
    } catch (error: any) {
      errorMessage = error.message;
    }

    const duration = Date.now() - startTime;

    // Log the delivery attempt
    await supabase.from('webhook_delivery_logs').insert({
      webhook_endpoint_id: webhookId,
      event_type: eventType,
      event_data: eventData,
      request_payload: payload,
      request_headers: headers,
      response_status: responseStatus,
      response_body: responseBody.substring(0, 5000),
      delivery_status: deliveryStatus,
      attempt_number: 1,
      max_attempts: webhook.max_retries,
      error_message: errorMessage,
      duration_ms: duration,
      delivered_at: deliveryStatus === 'success' ? new Date().toISOString() : null
    });

  } catch (error) {
    console.error('Error delivering webhook:', error);
  }
}
