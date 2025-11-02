import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface ChangePINModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePINModal({ open, onOpenChange }: ChangePINModalProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({ title: 'Invalid PIN', description: 'New PIN must be exactly 4 digits', variant: 'destructive' });
      return;
    }

    if (newPin !== confirmPin) {
      toast({ title: 'PINs do not match', description: 'Please ensure both new PINs are identical', variant: 'destructive' });
      return;
    }

    if (currentPin === newPin) {
      toast({ title: 'Same PIN', description: 'New PIN must be different from current PIN', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Verify current PIN
      const { error: verifyError } = await supabase.functions.invoke('verify-transaction-pin', {
        body: { pin: currentPin },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (verifyError) {
        toast({ title: 'Incorrect PIN', description: 'Current PIN is incorrect', variant: 'destructive' });
        setLoading(false);
        return;
      }

      // Set new PIN
      const { error: setError } = await supabase.functions.invoke('set-transaction-pin', {
        body: { pin: newPin },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (setError) throw setError;

      toast({ title: 'Success', description: 'Transaction PIN changed successfully' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Transaction PIN
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPin">Current PIN</Label>
            <Input
              id="currentPin"
              type={showPins ? 'text' : 'password'}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              placeholder="••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPin">New PIN</Label>
            <div className="relative">
              <Input
                id="newPin"
                type={showPins ? 'text' : 'password'}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                placeholder="••••"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPins(!showPins)}
              >
                {showPins ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm New PIN</Label>
            <Input
              id="confirmPin"
              type={showPins ? 'text' : 'password'}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              placeholder="••••"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Changing...' : 'Change PIN'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}