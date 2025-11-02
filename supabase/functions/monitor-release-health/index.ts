export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { releaseId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get release
    const releaseRes = await fetch(
      `${supabaseUrl}/rest/v1/releases?id=eq.${releaseId}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    const releases = await releaseRes.json();
    const release = releases[0];

    // Get crash rate from beta_crashes
    const crashRes = await fetch(
      `${supabaseUrl}/rest/v1/beta_crashes?version=eq.${release.version}&select=count`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    const crashes = await crashRes.json();
    const crashCount = crashes.length;

    // Calculate crash rate (crashes per 1000 sessions)
    const crashRate = (crashCount / 1000) * 100;

    // Update release metrics
    await fetch(`${supabaseUrl}/rest/v1/release_metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        release_id: releaseId,
        metric_type: 'crash_rate',
        metric_value: crashRate
      })
    });

    // Auto-rollback if crash rate exceeds threshold
    if (crashRate > release.crash_threshold) {
      await fetch(`${supabaseUrl}/rest/v1/releases?id=eq.${releaseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          status: 'rolled_back',
          rolled_back_at: new Date().toISOString(),
          rollback_reason: `Automatic rollback: crash rate ${crashRate.toFixed(2)}% exceeds threshold ${release.crash_threshold}%`
        })
      });

      return new Response(JSON.stringify({ 
        success: true, 
        rolledBack: true,
        crashRate 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      crashRate,
      healthy: true 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
