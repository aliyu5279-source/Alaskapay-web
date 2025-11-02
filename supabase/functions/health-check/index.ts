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

    const checks = [];

    // Check Supabase Database
    const dbStart = Date.now();
    try {
      await supabase.from('users').select('count').limit(1);
      checks.push({
        service_name: 'supabase_database',
        status: 'healthy',
        response_time_ms: Date.now() - dbStart,
      });
    } catch (error) {
      checks.push({
        service_name: 'supabase_database',
        status: 'down',
        response_time_ms: Date.now() - dbStart,
        error_message: error.message,
      });
    }

    // Check Stripe API
    const stripeStart = Date.now();
    try {
      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
      if (stripeKey) {
        const res = await fetch('https://api.stripe.com/v1/balance', {
          headers: { 'Authorization': `Bearer ${stripeKey}` },
        });
        checks.push({
          service_name: 'stripe_api',
          status: res.ok ? 'healthy' : 'degraded',
          response_time_ms: Date.now() - stripeStart,
        });
      }
    } catch (error) {
      checks.push({
        service_name: 'stripe_api',
        status: 'down',
        response_time_ms: Date.now() - stripeStart,
        error_message: error.message,
      });
    }

    // Log all checks
    for (const check of checks) {
      await supabase.from('health_check_logs').insert(check);
    }

    return new Response(JSON.stringify({ checks, timestamp: new Date() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
