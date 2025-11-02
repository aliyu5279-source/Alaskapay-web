import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get queued webhooks ready for delivery
    const { data: queuedWebhooks, error } = await supabase
      .from('webhook_queue')
      .select('*')
      .eq('status', 'queued')
      .lte('scheduled_for', new Date().toISOString())
      .limit(50);

    if (error) throw error;

    let processed = 0;
    let failed = 0;

    for (const item of queuedWebhooks || []) {
      try {
        // Mark as processing
        await supabase
          .from('webhook_queue')
          .update({ status: 'processing', attempts: item.attempts + 1 })
          .eq('id', item.id);

        // Get webhook endpoint
        const { data: webhook } = await supabase
          .from('webhook_endpoints')
          .select('*')
          .eq('id', item.webhook_id)
          .single();

        if (!webhook || !webhook.is_active) {
          await supabase.from('webhook_queue').delete().eq('id', item.id);
          continue;
        }

        // Deliver webhook
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AlaskaPay-Webhook-Queue/1.0',
          },
          body: JSON.stringify(item.payload),
        });

        if (response.ok) {
          await supabase
            .from('webhook_queue')
            .update({ status: 'delivered', processed_at: new Date().toISOString() })
            .eq('id', item.id);
          processed++;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        failed++;
        // Retry logic: if attempts < 5, reschedule, otherwise mark as failed
        if (item.attempts < 5) {
          const nextAttempt = new Date();
          nextAttempt.setMinutes(nextAttempt.getMinutes() + Math.pow(2, item.attempts));
          await supabase
            .from('webhook_queue')
            .update({ 
              status: 'queued', 
              scheduled_for: nextAttempt.toISOString() 
            })
            .eq('id', item.id);
        } else {
          await supabase
            .from('webhook_queue')
            .update({ status: 'failed', processed_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }
    }

    return new Response(
      JSON.stringify({ processed, failed, total: queuedWebhooks?.length || 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
