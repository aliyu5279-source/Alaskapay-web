import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';
import { PINVerificationModal } from '@/components/pin/PINVerificationModal';

interface CreateVirtualCardModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateVirtualCardModal({ open, onClose, onSuccess }: CreateVirtualCardModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardType: 'visa',
    cardDesign: 'default',
    spendingLimitDaily: '',
    spendingLimitMonthly: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '100001'
  });
  const { toast } = useToast();

  const handleContinueToPIN = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cardName || !formData.address) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setShowPinVerification(true);
  };

  const handlePINVerified = async () => {
    setShowPinVerification(false);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('create-virtual-card', {
        body: {
          cardName: formData.cardName,
          cardType: formData.cardType,
          cardDesign: formData.cardDesign,
          spendingLimitDaily: formData.spendingLimitDaily ? parseFloat(formData.spendingLimitDaily) : null,
          spendingLimitMonthly: formData.spendingLimitMonthly ? parseFloat(formData.spendingLimitMonthly) : null,
          billingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode
          }
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Virtual card created successfully'
      });

      onSuccess();
      onClose();
      setFormData({
        cardName: '',
        cardType: 'visa',
        cardDesign: 'default',
        spendingLimitDaily: '',
        spendingLimitMonthly: '',
        address: '',
        city: 'Lagos',
        state: 'Lagos',
        postalCode: '100001'
      });
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
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Virtual Card</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleContinueToPIN} className="space-y-4">
            <div>
              <Label htmlFor="cardName">Card Name</Label>
              <Input
                id="cardName"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                placeholder="Shopping Card"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardType">Card Type</Label>
              <Select value={formData.cardType} onValueChange={(value) => setFormData({ ...formData, cardType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cardDesign">Card Design</Label>
              <Select value={formData.cardDesign} onValueChange={(value) => setFormData({ ...formData, cardDesign: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Blue</SelectItem>
                  <SelectItem value="gradient-blue">Cyan Gradient</SelectItem>
                  <SelectItem value="gradient-purple">Purple Gradient</SelectItem>
                  <SelectItem value="black-gold">Black Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="spendingLimitDaily">Daily Spending Limit (₦)</Label>
              <Input
                id="spendingLimitDaily"
                type="number"
                value={formData.spendingLimitDaily}
                onChange={(e) => setFormData({ ...formData, spendingLimitDaily: e.target.value })}
                placeholder="50000"
              />
            </div>

            <div>
              <Label htmlFor="spendingLimitMonthly">Monthly Spending Limit (₦)</Label>
              <Input
                id="spendingLimitMonthly"
                type="number"
                value={formData.spendingLimitMonthly}
                onChange={(e) => setFormData({ ...formData, spendingLimitMonthly: e.target.value })}
                placeholder="500000"
              />
            </div>

            <div>
              <Label htmlFor="address">Billing Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <Shield className="mr-2 h-4 w-4" />
              Continue to PIN
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <PINVerificationModal
        open={showPinVerification}
        onOpenChange={setShowPinVerification}
        onVerified={handlePINVerified}
        description="Enter your 4-digit PIN to confirm virtual card creation"
      />
    </>
  );
}
