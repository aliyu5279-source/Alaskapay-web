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

    const { action, template, templateId, versionId } = await req.json();

    switch (action) {
      case 'list': {
        const { data, error } = await supabaseClient
          .from('email_templates')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get': {
        const { data, error } = await supabaseClient
          .from('email_templates')
          .select('*')
          .eq('id', templateId)
          .single();
        
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'create': {
        const { data, error } = await supabaseClient
          .from('email_templates')
          .insert([{ ...template, version: 1, created_by: user.id }])
          .select()
          .single();
        
        if (error) throw error;

        // Create version history
        await supabaseClient.from('email_template_versions').insert([{
          template_id: data.id,
          version: 1,
          name: data.name,
          subject: data.subject,
          html_content: data.html_content,
          text_content: data.text_content,
          variables: data.variables,
          created_by: user.id
        }]);

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'update': {
        const current = await supabaseClient
          .from('email_templates')
          .select('version')
          .eq('id', template.id)
          .single();

        const newVersion = (current.data?.version || 1) + 1;

        const { data, error } = await supabaseClient
          .from('email_templates')
          .update({ ...template, version: newVersion, updated_at: new Date().toISOString() })
          .eq('id', template.id)
          .select()
          .single();
        
        if (error) throw error;

        // Create version history
        await supabaseClient.from('email_template_versions').insert([{
          template_id: data.id,
          version: newVersion,
          name: data.name,
          subject: data.subject,
          html_content: data.html_content,
          text_content: data.text_content,
          variables: data.variables,
          created_by: user.id
        }]);

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'delete': {
        const { error } = await supabaseClient
          .from('email_templates')
          .delete()
          .eq('id', template.id);
        
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
