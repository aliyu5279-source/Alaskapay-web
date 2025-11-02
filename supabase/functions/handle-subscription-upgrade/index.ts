export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { subscription_id, new_plan_id, prorate = true } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get current subscription
    const subRes = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?id=eq.${subscription_id}&select=*,subscription_plans(*)`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    );
    const [subscription] = await subRes.json();

    if (!subscription) throw new Error('Subscription not found');

    // Get new plan
    const planRes = await fetch(
      `${supabaseUrl}/rest/v1/subscription_plans?id=eq.${new_plan_id}`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    );
    const [newPlan] = await planRes.json();

    if (!newPlan) throw new Error('Plan not found');

    const oldPrice = subscription.subscription_plans.price;
    const newPrice = newPlan.price;
    const isUpgrade = newPrice > oldPrice;

    let prorateAmount = 0;
    if (prorate) {
      const now = new Date();
      const periodStart = new Date(subscription.current_period_start);
      const periodEnd = new Date(subscription.current_period_end);
      const totalDays = (periodEnd.getTime() - periodStart.getTime()) / 86400000;
      const remainingDays = (periodEnd.getTime() - now.getTime()) / 86400000;
      const unusedAmount = (oldPrice / totalDays) * remainingDays;
      
      prorateAmount = isUpgrade ? (newPrice - unusedAmount) : 0;
    }

    // Update subscription
    await fetch(`${supabaseUrl}/rest/v1/subscriptions?id=eq.${subscription_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan_id: new_plan_id,
        updated_at: new Date().toISOString()
      })
    });

    // Create proration invoice if applicable
    if (prorate && prorateAmount > 0) {
      await fetch(`${supabaseUrl}/rest/v1/subscription_invoices`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription_id,
          user_id: subscription.user_id,
          amount: prorateAmount,
          currency: newPlan.currency,
          status: 'paid',
          invoice_type: 'proration',
          due_date: new Date().toISOString(),
          paid_at: new Date().toISOString()
        })
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      prorate_amount: prorateAmount,
      is_upgrade: isUpgrade 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
