import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { userId, notification } = await req.json();

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (subError) throw subError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No active subscriptions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
    const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');
    const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@alaskapay.com';

    // Send to all user's devices
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const response = await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'TTL': '86400',
              'Authorization': `vapid t=${await generateVAPIDToken(sub.endpoint, VAPID_SUBJECT!, VAPID_PUBLIC_KEY!, VAPID_PRIVATE_KEY!)}, k=${VAPID_PUBLIC_KEY}`
            },
            body: JSON.stringify({
              notification: {
                title: notification.title,
                body: notification.body,
                icon: notification.icon,
                badge: notification.badge,
                tag: notification.tag,
                data: notification.data,
                requireInteraction: notification.data?.type === 'security_alert',
                vibrate: [200, 100, 200]
              }
            })
          });

          if (!response.ok) {
            if (response.status === 410) {
              // Subscription expired, deactivate it
              await supabaseClient
                .from('push_subscriptions')
                .update({ is_active: false })
                .eq('id', sub.id);
            }
            throw new Error(`Push failed: ${response.status}`);
          }

          return { success: true, subscriptionId: sub.id };
        } catch (error) {
          console.error('Error sending to subscription:', error);
          return { success: false, subscriptionId: sub.id, error: error.message };
        }
      })
    );

    // Log notification
    await supabaseClient.from('notification_logs').insert({
      user_id: userId,
      type: notification.data?.type || 'unknown',
      title: notification.title,
      body: notification.body,
      sent_at: new Date().toISOString(),
      delivery_status: results.filter(r => r.status === 'fulfilled' && r.value.success).length > 0 ? 'delivered' : 'failed'
    });

    return new Response(JSON.stringify({ 
      success: true,
      delivered: results.filter(r => r.status === 'fulfilled' && r.value.success).length,
      total: subscriptions.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

async function generateVAPIDToken(endpoint: string, subject: string, publicKey: string, privateKey: string): Promise<string> {
  // Simplified VAPID token generation
  // In production, use a proper JWT library
  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = btoa(JSON.stringify({
    aud: new URL(endpoint).origin,
    exp: Math.floor(Date.now() / 1000) + 43200,
    sub: subject
  }));
  return `${header}.${payload}.signature`;
}
