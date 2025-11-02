import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@alaskapay.com';

async function sendEmail(to: string, subject: string, html: string, trackingId: string) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }], custom_args: { tracking_id: trackingId } }],
      from: { email: FROM_EMAIL, name: 'Alaska Pay' },
      subject,
      content: [{ type: 'text/html', value: html }],
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }
  return response;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not configured');
    const supabase = createClient(Deno.env.get('SUPABASE_URL')??'', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')??'');
    const { to, emailType, data } = await req.json();
    
    const trackingId = crypto.randomUUID();
    const { getTemplate } = await import('./templates.ts');
    const template = getTemplate(emailType, data);
    
    await sendEmail(to, template.subject, template.html, trackingId);
    
    await supabase.from('email_delivery_tracking').insert({
      tracking_id: trackingId,
      recipient: to,
      email_type: emailType,
      subject: template.subject,
      status: 'sent',
      metadata: data,
    });
    
    return new Response(JSON.stringify({sent:true,trackingId}),{headers:{...corsHeaders,'Content-Type':'application/json'}});
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({error:error.message}),{status:400,headers:{...corsHeaders,'Content-Type':'application/json'}});
  }
});
