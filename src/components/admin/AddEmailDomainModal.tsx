import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addEmailDomain } from '@/lib/emailDomainService';
import { toast } from 'sonner';

interface AddEmailDomainModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEmailDomainModal({ onClose, onSuccess }: AddEmailDomainModalProps) {
  const [domain, setDomain] = useState('');
  const [dmarcPolicy, setDmarcPolicy] = useState('quarantine');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await addEmailDomain(domain, dmarcPolicy);

    if (error) {
      toast.error('Failed to add email domain');
    } else {
      toast.success('Email domain added successfully');
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Email Sending Domain</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="domain">Domain Name</Label>
            <Input
              id="domain"
              type="text"
              placeholder="mail.yourdomain.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the subdomain you want to send emails from
            </p>
          </div>

          <div>
            <Label htmlFor="dmarc-policy">DMARC Policy</Label>
            <Select value={dmarcPolicy} onValueChange={setDmarcPolicy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Monitor only)</SelectItem>
                <SelectItem value="quarantine">Quarantine (Recommended)</SelectItem>
                <SelectItem value="reject">Reject (Strict)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Start with "quarantine" and move to "reject" once verified
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Domain'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
