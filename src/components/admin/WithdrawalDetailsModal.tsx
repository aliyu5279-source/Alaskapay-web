import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { logAdminAction } from '@/lib/auditLogger';
import { Withdrawal } from './WithdrawalManagementTab';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface Props {
  withdrawal: Withdrawal;
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawalDetailsModal: React.FC<Props> = ({ withdrawal, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const { error } = await supabase.functions.invoke('process-withdrawal', {
        body: { withdrawal_id: withdrawal.id }
      });

      if (error) throw error;

      await logAdminAction({
        action: 'withdrawal_approved',
        resource_type: 'withdrawal',
        resource_id: withdrawal.id,
        details: `Approved withdrawal of ₦${withdrawal.amount} to ${withdrawal.bank_name}`
      });

      toast({ title: 'Success', description: 'Withdrawal approved and processing' });
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({ title: 'Error', description: 'Please provide a reason', variant: 'destructive' });
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status: 'failed', failure_reason: rejectionReason })
        .eq('id', withdrawal.id);

      if (error) throw error;

      // Refund to wallet
      const { error: refundError } = await supabase.rpc('credit_wallet', {
        p_user_id: withdrawal.user_id,
        p_amount: withdrawal.amount + withdrawal.fee
      });

      if (refundError) throw refundError;

      await logAdminAction({
        action: 'withdrawal_rejected',
        resource_type: 'withdrawal',
        resource_id: withdrawal.id,
        details: `Rejected withdrawal: ${rejectionReason}`
      });

      toast({ title: 'Success', description: 'Withdrawal rejected and refunded' });
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Withdrawal Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Reference</label>
              <p className="font-mono">{withdrawal.reference}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <div><Badge>{withdrawal.status}</Badge></div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Amount</label>
              <p className="font-bold text-lg">₦{withdrawal.amount.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Fee</label>
              <p>₦{withdrawal.fee.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Bank Name</label>
              <p>{withdrawal.bank_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Account Number</label>
              <p>{withdrawal.account_number}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-500">Account Name</label>
              <p>{withdrawal.account_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Created At</label>
              <p>{format(new Date(withdrawal.created_at), 'PPpp')}</p>
            </div>
            {withdrawal.processed_at && (
              <div>
                <label className="text-sm text-gray-500">Processed At</label>
                <p>{format(new Date(withdrawal.processed_at), 'PPpp')}</p>
              </div>
            )}
          </div>

          {withdrawal.status === 'pending' && (
            <div>
              <label className="text-sm text-gray-500 block mb-2">Rejection Reason (if rejecting)</label>
              <Textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
              />
            </div>
          )}

          {withdrawal.failure_reason && (
            <div className="bg-red-50 p-3 rounded-lg">
              <label className="text-sm text-red-700 font-medium">Failure Reason</label>
              <p className="text-red-900">{withdrawal.failure_reason}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={processing}>Close</Button>
          {withdrawal.status === 'pending' && (
            <>
              <Button variant="destructive" onClick={handleReject} disabled={processing}>
                {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Reject
              </Button>
              <Button onClick={handleApprove} disabled={processing}>
                {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDetailsModal;
