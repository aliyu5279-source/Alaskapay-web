import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')??'', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')??'');
    const events = await req.json();
    
    for (const event of events) {
      const trackingId = event.tracking_id || event.custom_args?.tracking_id;
      if (!trackingId) continue;
      
      const eventType = event.event;
      const timestamp = new Date(event.timestamp * 1000).toISOString();
      
      const updateData: any = { last_event: eventType, last_event_at: timestamp };
      
      if (eventType === 'delivered') updateData.status = 'delivered';
      else if (eventType === 'open') updateData.opened_at = timestamp;
      else if (eventType === 'click') updateData.clicked_at = timestamp;
      else if (eventType === 'bounce') {
        updateData.status = 'bounced';
        updateData.bounce_reason = event.reason;
        await supabase.from('email_bounces').insert({
          email: event.email,
          bounce_type: event.type,
          reason: event.reason,
          timestamp,
        });
      } else if (eventType === 'dropped') {
        updateData.status = 'dropped';
        updateData.drop_reason = event.reason;
      }
      
      await supabase.from('email_delivery_tracking').update(updateData).eq('tracking_id', trackingId);
    }
    
    return new Response(JSON.stringify({processed: events.length}),{headers:{...corsHeaders,'Content-Type':'application/json'}});
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({error:error.message}),{status:400,headers:{...corsHeaders,'Content-Type':'application/json'}});
  }
});
