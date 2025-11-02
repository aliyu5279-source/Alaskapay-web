import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Loader2 } from 'lucide-react';
import PaymentMethodCard from './PaymentMethodCard';
import AddPaymentMethodForm from './AddPaymentMethodForm';
import PaymentHistoryTable from './PaymentHistoryTable';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  getUserPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod
} from '@/services/paymentMethodService';

const PaymentMethodsPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await getUserPaymentMethods(user!.id);
      setPaymentMethods(methods);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      await deletePaymentMethod(user!.id, id);
      toast({
        title: 'Success',
        description: 'Card removed successfully'
      });
      loadPaymentMethods();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(user!.id, id);
      toast({
        title: 'Success',
        description: 'Default card updated'
      });
      loadPaymentMethods();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Payment Settings</h1>

      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Cards</CardTitle>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddForm && (
                <AddPaymentMethodForm
                  onSuccess={() => {
                    setShowAddForm(false);
                    loadPaymentMethods();
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : paymentMethods.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No payment methods added yet
                </p>
              ) : (
                paymentMethods.map((pm) => (
                  <PaymentMethodCard
                    key={pm.id}
                    paymentMethod={pm}
                    onDelete={handleDeletePaymentMethod}
                    onSetDefault={handleSetDefault}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentHistoryTable transactions={[]} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentMethodsPage;
