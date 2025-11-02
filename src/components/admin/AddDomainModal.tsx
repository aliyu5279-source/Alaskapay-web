import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { domainService } from '@/lib/domainService';
import { useToast } from '@/hooks/use-toast';

interface AddDomainModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDomainModal({ onClose, onSuccess }: AddDomainModalProps) {
  const [domain, setDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [domainType, setDomainType] = useState<'web' | 'api' | 'both'>('web');
  const [registrar, setRegistrar] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await domainService.addDomain({
        domain,
        subdomain: subdomain || undefined,
        domain_type: domainType,
        registrar: registrar || undefined
      });

      toast({
        title: 'Domain added',
        description: 'Your domain has been added. Configure DNS records to verify.'
      });

      onSuccess();
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Domain</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">Subdomain (optional)</Label>
            <Input
              id="subdomain"
              placeholder="app"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for root domain or enter subdomain like "app" for app.example.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Domain Type</Label>
            <Select value={domainType} onValueChange={(v: any) => setDomainType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Only</SelectItem>
                <SelectItem value="api">API Only</SelectItem>
                <SelectItem value="both">Web + API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrar">Domain Registrar (optional)</Label>
            <Select value={registrar} onValueChange={setRegistrar}>
              <SelectTrigger>
                <SelectValue placeholder="Select registrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="godaddy">GoDaddy</SelectItem>
                <SelectItem value="namecheap">Namecheap</SelectItem>
                <SelectItem value="cloudflare">Cloudflare</SelectItem>
                <SelectItem value="google">Google Domains</SelectItem>
                <SelectItem value="route53">AWS Route 53</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
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
