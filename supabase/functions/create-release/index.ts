export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { version, platform, changelog, commits, buildNumber } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create release
    const releaseRes = await fetch(`${supabaseUrl}/rest/v1/releases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        version,
        build_number: buildNumber,
        platform,
        status: 'pending_approval',
        changelog,
        rollout_percentage: 0,
        crash_threshold: 5.0
      })
    });

    const release = await releaseRes.json();
    const releaseId = release[0].id;

    // Add commits
    if (commits && commits.length > 0) {
      await fetch(`${supabaseUrl}/rest/v1/release_commits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(commits.map((c: any) => ({
          release_id: releaseId,
          ...c
        })))
      });
    }

    // Create rollout stages
    const stages = [
      { stage_number: 1, percentage: 10 },
      { stage_number: 2, percentage: 50 },
      { stage_number: 3, percentage: 100 }
    ];

    await fetch(`${supabaseUrl}/rest/v1/release_rollout_stages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(stages.map(s => ({
        release_id: releaseId,
        ...s,
        status: 'pending'
      })))
    });

    return new Response(JSON.stringify({ success: true, releaseId }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
