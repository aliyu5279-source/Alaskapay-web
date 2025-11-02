import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';

interface ReleaseApprovalModalProps {
  release: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReleaseApprovalModal({ release, onClose, onSuccess }: ReleaseApprovalModalProps) {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApproval = async (approved: boolean) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Record approval
      const { error: approvalError } = await supabase.from('release_approvals').insert({
        release_id: release.id,
        approver_id: user?.id,
        status: approved ? 'approved' : 'rejected',
        comments
      });

      if (approvalError) throw approvalError;

      // Update release status
      const { error: updateError } = await supabase
        .from('releases')
        .update({
          status: approved ? 'approved' : 'rejected',
          approved_by: approved ? user?.id : null,
          approved_at: approved ? new Date().toISOString() : null
        })
        .eq('id', release.id);

      if (updateError) throw updateError;

      toast({
        title: approved ? 'Release approved' : 'Release rejected',
        description: `Version ${release.version} has been ${approved ? 'approved' : 'rejected'}`
      });

      onSuccess();
      onClose();
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Release</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">v{release.version}</h3>
              <Badge variant="outline">{release.platform}</Badge>
            </div>
            <p className="text-sm text-gray-600">Build #{release.build_number}</p>
          </div>

          <div>
            <Label>Changelog</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded border">
              <pre className="text-sm whitespace-pre-wrap">{release.changelog}</pre>
            </div>
          </div>

          <div>
            <Label>Crash Threshold</Label>
            <p className="text-sm text-gray-600 mt-1">
              Auto-rollback if crash rate exceeds {release.crash_threshold}%
            </p>
          </div>

          <div>
            <Label>Comments (Optional)</Label>
            <Textarea
              placeholder="Add approval comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleApproval(false)}
              disabled={loading}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => handleApproval(true)}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
