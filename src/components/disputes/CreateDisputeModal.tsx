import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateDisputeModalProps {
  open: boolean;
  onClose: () => void;
  transaction: any;
  onSuccess: () => void;
}

export function CreateDisputeModal({ open, onClose, transaction, onSuccess }: CreateDisputeModalProps) {
  const [disputeType, setDisputeType] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const disputeTypes = [
    { value: 'unauthorized', label: 'Unauthorized Transaction' },
    { value: 'incorrect_amount', label: 'Incorrect Amount' },
    { value: 'duplicate', label: 'Duplicate Charge' },
    { value: 'service_not_received', label: 'Service Not Received' },
    { value: 'quality_issue', label: 'Quality Issue' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeType || !reason) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create dispute
      const { data: dispute, error: disputeError } = await supabase
        .from('transaction_disputes')
        .insert({
          user_id: user.id,
          transaction_id: transaction.id,
          dispute_type: disputeType,
          amount: transaction.amount,
          currency: transaction.currency || 'NGN',
          reason,
          description,
          priority: transaction.amount > 100000 ? 'high' : 'normal'
        })
        .select()
        .single();

      if (disputeError) throw disputeError;

      // Upload evidence files
      for (const file of files) {
        const fileName = `${dispute.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('dispute-evidence')
          .upload(fileName, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('dispute-evidence')
            .getPublicUrl(fileName);

          await supabase.from('dispute_evidence').insert({
            dispute_id: dispute.id,
            user_id: user.id,
            file_name: file.name,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size
          });
        }
      }

      // Log audit
      await supabase.from('dispute_audit_logs').insert({
        dispute_id: dispute.id,
        user_id: user.id,
        action: 'dispute_created',
        new_status: 'pending'
      });

      toast({ title: 'Dispute created successfully' });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error creating dispute', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Dispute</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Transaction: {transaction?.description} - ₦{transaction?.amount?.toLocaleString()}
            </AlertDescription>
          </Alert>

          <div>
            <Label>Dispute Type *</Label>
            <Select value={disputeType} onValueChange={setDisputeType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {disputeTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reason *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Brief reason for dispute"
              rows={2}
            />
          </div>

          <div>
            <Label>Detailed Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information"
              rows={4}
            />
          </div>

          <div>
            <Label>Upload Evidence</Label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="evidence-upload"
                accept="image/*,.pdf"
              />
              <label htmlFor="evidence-upload">
                <Button type="button" variant="outline" asChild>
                  <span><Upload className="w-4 h-4 mr-2" />Choose Files</span>
                </Button>
              </label>
              {files.length > 0 && <span className="text-sm">{files.length} file(s) selected</span>}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Submit Dispute'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
