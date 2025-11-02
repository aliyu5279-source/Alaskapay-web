import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { subscriptionService } from '@/lib/subscriptionService';
import { toast } from 'sonner';

interface SubscriptionPlansProps {
  currentPlanId?: string;
}

export default function SubscriptionPlans({ currentPlanId }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('price', { ascending: true });
    
    if (data) setPlans(data);
  };

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get default payment method
      const { data: paymentMethod } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      if (!paymentMethod) {
        toast.error('Please add a payment method first');
        return;
      }

      await subscriptionService.createSubscription({
        user_id: user.id,
        plan_id: planId,
        payment_method_id: paymentMethod.id,
        authorization_code: paymentMethod.paystack_auth_code
      });

      toast.success('Subscription created successfully!');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!subscription) throw new Error('No active subscription');

      await subscriptionService.upgradeSubscription(subscription.id, planId, true);
      toast.success('Plan upgraded successfully!');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upgrade plan');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (index: number) => {
    const icons = [Zap, Rocket, Crown];
    const Icon = icons[index] || Zap;
    return <Icon className="h-8 w-8" />;
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan, index) => (
        <Card key={plan.id} className={`p-6 ${plan.id === currentPlanId ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            {getIcon(index)}
            <h3 className="text-2xl font-bold">{plan.name}</h3>
          </div>
          
          {plan.id === currentPlanId && (
            <Badge className="mb-4">Current Plan</Badge>
          )}
          
          <div className="mb-6">
            <span className="text-4xl font-bold">₦{plan.price.toLocaleString()}</span>
            <span className="text-gray-600">/{plan.billing_cycle}</span>
          </div>

          <ul className="space-y-3 mb-6">
            {plan.features?.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className="w-full"
            disabled={loading || plan.id === currentPlanId}
            onClick={() => currentPlanId ? handleUpgrade(plan.id) : handleSubscribe(plan.id)}
          >
            {plan.id === currentPlanId ? 'Current Plan' : currentPlanId ? 'Upgrade' : 'Subscribe'}
          </Button>
        </Card>
      ))}
    </div>
  );
}
