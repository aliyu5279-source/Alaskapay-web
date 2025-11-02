import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { logAdminAction } from '@/lib/auditLogger';
import { Loader2 } from 'lucide-react';

interface Props {
  selectedIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}

const BatchWithdrawalModal: React.FC<Props> = ({ selectedIds, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleBatchProcess = async () => {
    setProcessing(true);
    
    try {
      const results = await Promise.allSettled(
        selectedIds.map(id => 
          supabase.functions.invoke('process-withdrawal', {
            body: { withdrawal_id: id }
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      await logAdminAction({
        action: 'batch_withdrawal_processed',
        resource_type: 'withdrawal',
        resource_id: 'batch',
        details: `Processed ${successful} withdrawals, ${failed} failed`,
        metadata: { selectedIds, successful, failed }
      });

      toast({
        title: 'Batch Processing Complete',
        description: `${successful} successful, ${failed} failed`
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Batch Withdrawals</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700">
            You are about to process <span className="font-bold">{selectedIds.length}</span> withdrawal requests.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action will initiate bank transfers via Paystack for all selected pending withdrawals.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handleBatchProcess} disabled={processing}>
            {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Process {selectedIds.length} Withdrawals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchWithdrawalModal;
