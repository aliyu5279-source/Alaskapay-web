import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, FileText, Settings, PauseCircle, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import SubscriptionPlans from './SubscriptionPlans';
import { PauseSubscriptionModal } from './PauseSubscriptionModal';
import { subscriptionService } from '@/lib/subscriptionService';
import { toast as sonnerToast } from 'sonner';

export default function SubscriptionPortal() {
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();
    fetchInvoices();
  }, []);

  const fetchSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', user.id)
      .in('status', ['active', 'paused'])
      .single();
    
    if (data) setSubscription(data);
  };

  const fetchInvoices = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('subscription_invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setInvoices(data);
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    const { error } = await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('id', subscription.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Subscription will cancel at period end' });
      fetchSubscription();
    }
  };

  const handleResumeSubscription = async () => {
    if (!subscription) return;
    
    try {
      await subscriptionService.resumeSubscription({
        subscription_id: subscription.id,
        immediate: true
      });
      sonnerToast.success('Subscription resumed successfully');
      fetchSubscription();
    } catch (error: any) {
      sonnerToast.error(error.message || 'Failed to resume subscription');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="plans">All Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {subscription ? (
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{subscription.subscription_plans.name}</h2>
                  <Badge className="mt-2">{subscription.status}</Badge>
                  
                  {subscription.status === 'paused' ? (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        Paused on: {new Date(subscription.paused_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Will resume: {new Date(subscription.resume_at).toLocaleDateString()}
                      </p>
                      {subscription.pause_reason && (
                        <p className="text-sm text-gray-600">Reason: {subscription.pause_reason}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4">Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {subscription.status === 'active' && (
                    <Button 
                      variant="outline" 
                      onClick={() => setPauseModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <PauseCircle className="h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  
                  {subscription.status === 'paused' && (
                    <Button 
                      onClick={handleResumeSubscription}
                      className="flex items-center gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Resume Now
                    </Button>
                  )}
                  
                  <Button variant="destructive" onClick={handleCancelSubscription}>
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p>No active subscription</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans">
          <SubscriptionPlans currentPlanId={subscription?.plan_id} />
        </TabsContent>

        <TabsContent value="invoices">
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{invoice.invoice_number}</p>
                  <p className="text-sm text-gray-600">{new Date(invoice.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₦{invoice.amount}</p>
                  <Badge>{invoice.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {subscription && (
        <PauseSubscriptionModal
          subscription={subscription}
          open={pauseModalOpen}
          onClose={() => setPauseModalOpen(false)}
          onSuccess={fetchSubscription}
        />
      )}
    </div>
  );
}
