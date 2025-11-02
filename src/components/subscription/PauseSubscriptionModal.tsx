import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { subscriptionService } from '@/lib/subscriptionService';
import { toast } from 'sonner';

interface PauseSubscriptionModalProps {
  subscription: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PauseSubscriptionModal({ subscription, open, onClose, onSuccess }: PauseSubscriptionModalProps) {
  const [reason, setReason] = useState('');
  const [resumeDate, setResumeDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handlePause = async () => {
    if (!resumeDate) {
      toast.error('Please select a resume date');
      return;
    }

    setLoading(true);
    try {
      await subscriptionService.pauseSubscription({
        subscription_id: subscription.id,
        pause_reason: reason,
        resume_at: resumeDate.toISOString()
      });

      toast.success('Subscription paused successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to pause subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Reason (Optional)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you pausing your subscription?"
              rows={3}
            />
          </div>

          <div>
            <Label>Resume Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {resumeDate ? format(resumeDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={resumeDate}
                  onSelect={setResumeDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-gray-600 mt-1">
              Maximum pause duration: 90 days
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePause} disabled={loading} className="flex-1">
              {loading ? 'Pausing...' : 'Pause Subscription'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
