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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { action, ...params } = await req.json();

    let result;
    switch (action) {
      case 'get_success_rate_trend':
        result = await getSuccessRateTrend(supabaseClient, params);
        break;
      case 'get_response_time_trend':
        result = await getResponseTimeTrend(supabaseClient, params);
        break;
      case 'get_most_active_endpoints':
        result = await getMostActiveEndpoints(supabaseClient, params);
        break;
      case 'get_failure_reasons':
        result = await getFailureReasons(supabaseClient, params);
        break;
      case 'get_performance_comparison':
        result = await getPerformanceComparison(supabaseClient, params);
        break;
      case 'export_analytics':
        result = await exportAnalytics(supabaseClient, params);
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getSuccessRateTrend(supabase: any, params: any) {
  const { webhook_id, days = 7 } = params;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabase
    .from('webhook_analytics_hourly')
    .select('*')
    .gte('hour_timestamp', startDate.toISOString())
    .order('hour_timestamp', { ascending: true });

  if (webhook_id) {
    query = query.eq('webhook_endpoint_id', webhook_id);
  }

  const { data, error } = await query;
  if (error) throw error;

  return { data };
}

async function getResponseTimeTrend(supabase: any, params: any) {
  const { webhook_id, days = 7 } = params;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabase
    .from('webhook_analytics_hourly')
    .select('hour_timestamp, avg_response_time_ms, p95_response_time_ms, webhook_endpoint_id')
    .gte('hour_timestamp', startDate.toISOString())
    .order('hour_timestamp', { ascending: true });

  if (webhook_id) {
    query = query.eq('webhook_endpoint_id', webhook_id);
  }

  const { data, error } = await query;
  if (error) throw error;

  return { data };
}

async function getMostActiveEndpoints(supabase: any, params: any) {
  const { limit = 10 } = params;

  const { data, error } = await supabase
    .from('webhook_endpoints')
    .select(`
      id, name, url,
      webhook_delivery_logs(count)
    `)
    .order('webhook_delivery_logs(count)', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return { data };
}

async function getFailureReasons(supabase: any, params: any) {
  const { webhook_id } = params;

  let query = supabase
    .from('webhook_failure_reasons')
    .select('*')
    .order('failure_count', { ascending: false });

  if (webhook_id) {
    query = query.eq('webhook_endpoint_id', webhook_id);
  }

  const { data, error } = await query;
  if (error) throw error;

  return { data };
}

async function getPerformanceComparison(supabase: any, params: any) {
  const { data: webhooks, error } = await supabase
    .from('webhook_endpoints')
    .select('id, name, event_type');

  if (error) throw error;

  const stats = await Promise.all(webhooks.map(async (webhook: any) => {
    const { data: logs } = await supabase
      .from('webhook_delivery_logs')
      .select('delivery_status, duration_ms')
      .eq('webhook_endpoint_id', webhook.id);

    const total = logs?.length || 0;
    const successful = logs?.filter((l: any) => l.delivery_status === 'success').length || 0;
    const avgTime = total > 0 
      ? Math.round(logs.reduce((sum: number, l: any) => sum + (l.duration_ms || 0), 0) / total)
      : 0;

    return {
      webhook_id: webhook.id,
      webhook_name: webhook.name,
      event_type: webhook.event_type,
      total_deliveries: total,
      success_rate: total > 0 ? Math.round((successful / total) * 100) : 0,
      avg_response_time: avgTime
    };
  }));

  return { data: stats };
}

async function exportAnalytics(supabase: any, params: any) {
  const { webhook_id, start_date, end_date, format = 'json' } = params;

  let query = supabase
    .from('webhook_delivery_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (webhook_id) query = query.eq('webhook_endpoint_id', webhook_id);
  if (start_date) query = query.gte('created_at', start_date);
  if (end_date) query = query.lte('created_at', end_date);

  const { data, error } = await query;
  if (error) throw error;

  return { data, format };
}
