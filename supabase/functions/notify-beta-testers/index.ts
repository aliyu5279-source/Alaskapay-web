export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { group, title, message, action_url, platform } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get testers in the specified group
    const testersResponse = await fetch(`${supabaseUrl}/rest/v1/beta_testers?test_group=eq.${group}&status=eq.active${platform ? `&platform=eq.${platform}` : ''}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const testers = await testersResponse.json();

    // Send email notifications via SendGrid
    const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
    
    const notifications = testers.map(async (tester: any) => {
      const emailData = {
        personalizations: [{
          to: [{ email: tester.email, name: tester.full_name }],
          dynamic_template_data: {
            title,
            message,
            action_url: action_url || 'testflight://open',
            tester_name: tester.full_name
          }
        }],
        from: { email: 'beta@alaskapay.com', name: 'Alaska Pay Beta' },
        template_id: 'd-beta-notification'
      };

      return fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
    });

    await Promise.all(notifications);

    return new Response(JSON.stringify({ 
      success: true, 
      notified: testers.length 
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
