import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, XCircle, DollarSign } from 'lucide-react';

export function DisputeManagementTab() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDisputes();
  }, [filter]);

  const loadDisputes = async () => {
    try {
      let query = supabase
        .from('transaction_disputes')
        .select(`
          *,
          transactions(description, type),
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDisputes(data || []);
    } catch (error) {
      console.error('Error loading disputes:', error);
    }
  };

  const updateDisputeStatus = async (disputeId: string, status: string, notes?: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates: any = { status };
      if (notes) updates.resolution_notes = notes;
      if (status === 'resolved' || status === 'rejected') {
        updates.resolved_by = user.id;
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('transaction_disputes')
        .update(updates)
        .eq('id', disputeId);

      if (error) throw error;

      await supabase.from('dispute_audit_logs').insert({
        dispute_id: disputeId,
        user_id: user.id,
        action: `status_changed_to_${status}`,
        new_status: status
      });

      toast({ title: 'Dispute updated successfully' });
      loadDisputes();
      setSelectedDispute(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async (disputeId: string, amount: number) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create refund transaction
      const dispute = disputes.find(d => d.id === disputeId);
      const { data: refundTx, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: dispute.user_id,
          type: 'refund',
          amount: amount,
          currency: dispute.currency,
          status: 'completed',
          description: `Refund for dispute ${disputeId.slice(0, 8)}`
        })
        .select()
        .single();

      if (txError) throw txError;

      // Update dispute
      await supabase
        .from('transaction_disputes')
        .update({
          status: 'refunded',
          refund_amount: amount,
          refund_transaction_id: refundTx.id,
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      // Update wallet
      await supabase.rpc('increment_wallet_balance', {
        p_user_id: dispute.user_id,
        p_amount: amount
      });

      toast({ title: 'Refund processed successfully' });
      loadDisputes();
      setSelectedDispute(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: disputes.length,
    pending: disputes.filter(d => d.status === 'pending').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    refunded: disputes.filter(d => d.status === 'refunded').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <AlertCircle className="w-8 h-8 mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Disputes</p>
        </Card>
        <Card className="p-4">
          <AlertCircle className="w-8 h-8 mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4">
          <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
          <p className="text-2xl font-bold">{stats.resolved}</p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </Card>
        <Card className="p-4">
          <DollarSign className="w-8 h-8 mb-2 text-emerald-500" />
          <p className="text-2xl font-bold">{stats.refunded}</p>
          <p className="text-sm text-muted-foreground">Refunded</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Disputes</h3>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Disputes</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {disputes.map(dispute => (
            <Card key={dispute.id} className="p-4 cursor-pointer hover:shadow-md"
              onClick={() => setSelectedDispute(dispute)}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{dispute.reason}</h4>
                  <p className="text-sm text-muted-foreground">
                    {dispute.profiles?.email} • {dispute.transactions?.description}
                  </p>
                  <p className="text-sm mt-1">
                    ₦{dispute.amount?.toLocaleString()} • {format(new Date(dispute.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <Badge>{dispute.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {selectedDispute && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resolve Dispute</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">User</p>
                <p className="font-semibold">{selectedDispute.profiles?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold">₦{selectedDispute.amount?.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reason</p>
              <p>{selectedDispute.reason}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => updateDisputeStatus(selectedDispute.id, 'under_review')} disabled={loading}>
                Review
              </Button>
              <Button onClick={() => updateDisputeStatus(selectedDispute.id, 'resolved')} disabled={loading}>
                Resolve
              </Button>
              <Button variant="destructive" onClick={() => updateDisputeStatus(selectedDispute.id, 'rejected')} disabled={loading}>
                Reject
              </Button>
              <Button variant="outline" onClick={() => processRefund(selectedDispute.id, selectedDispute.amount)} disabled={loading}>
                Process Refund
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
