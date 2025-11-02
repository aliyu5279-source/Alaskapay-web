import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, Calendar, History } from 'lucide-react';
import { SavedBillersList } from './bill/SavedBillersList';
import { AddBillerModal } from './bill/AddBillerModal';
import { PayBillModal } from './bill/PayBillModal';
import { ScheduledPaymentsList } from './bill/ScheduledPaymentsList';
import { BillPaymentHistory } from './bill/BillPaymentHistory';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function BillPaymentDashboard() {
  const [savedBillers, setSavedBillers] = useState([]);
  const [showAddBiller, setShowAddBiller] = useState(false);
  const [showPayBill, setShowPayBill] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedBillers();
  }, []);

  const loadSavedBillers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-saved-billers', {
        body: { action: 'list' }
      });
      if (error) throw error;
      setSavedBillers(data.billers || []);
    } catch (error) {
      toast.error('Failed to load saved billers');
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = (biller) => {
    setSelectedBiller(biller);
    setShowPayBill(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bill Payments</h1>
        <Button onClick={() => setShowAddBiller(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Biller
        </Button>
      </div>

      <Tabs defaultValue="billers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="billers">
            <Receipt className="mr-2 h-4 w-4" />
            My Billers
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Calendar className="mr-2 h-4 w-4" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="billers">
          <SavedBillersList
            billers={savedBillers}
            onPayBill={handlePayBill}
            onRefresh={loadSavedBillers}
          />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledPaymentsList />
        </TabsContent>

        <TabsContent value="history">
          <BillPaymentHistory />
        </TabsContent>
      </Tabs>

      <AddBillerModal
        open={showAddBiller}
        onClose={() => setShowAddBiller(false)}
        onSuccess={loadSavedBillers}
      />

      <PayBillModal
        open={showPayBill}
        onClose={() => setShowPayBill(false)}
        biller={selectedBiller}
        onSuccess={loadSavedBillers}
      />
    </div>
  );
}