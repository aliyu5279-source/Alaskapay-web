import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Copy, RefreshCw, ExternalLink } from 'lucide-react';
import { domainService, CustomDomain, DNSRecord } from '@/lib/domainService';
import { useToast } from '@/hooks/use-toast';

interface DomainDetailsModalProps {
  domain: CustomDomain;
  onClose: () => void;
  onUpdate: () => void;
}

export function DomainDetailsModal({ domain, onClose, onUpdate }: DomainDetailsModalProps) {
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDNSRecords();
  }, [domain.id]);

  const loadDNSRecords = async () => {
    try {
      const records = await domainService.getDNSRecords(domain.id);
      setDnsRecords(records);
    } catch (error) {
      console.error('Failed to load DNS records:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const verified = await domainService.verifyDomain(domain.id);
      if (verified) {
        toast({
          title: 'Domain verified',
          description: 'Your domain has been successfully verified'
        });
        onUpdate();
      } else {
        toast({
          title: 'Verification pending',
          description: 'DNS records not fully configured yet',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Verification failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setVerifying(false);
    }
  };

  const getRegistrarGuideUrl = () => {
    const guides: Record<string, string> = {
      godaddy: 'https://www.godaddy.com/help/manage-dns-records-680',
      namecheap: 'https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/',
      cloudflare: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/',
      google: 'https://support.google.com/domains/answer/3290350',
      route53: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-creating.html'
    };
    return guides[domain.registrar || ''] || '#';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Domain Configuration: {domain.full_domain}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dns" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dns">DNS Records</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="ssl">SSL Certificate</TabsTrigger>
          </TabsList>

          <TabsContent value="dns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Required DNS Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dnsRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{record.record_type}</Badge>
                        <span className="font-medium">{record.name}</span>
                        {record.is_configured && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(record.value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Value: <code className="bg-muted px-2 py-1 rounded">{record.value}</code></div>
                      <div>TTL: {record.ttl}</div>
                      {record.purpose && <div>Purpose: {record.purpose}</div>}
                    </div>
                  </div>
                ))}

                {domain.registrar && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(getRegistrarGuideUrl(), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View {domain.registrar} DNS Guide
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Domain Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Token</Label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-muted px-3 py-2 rounded text-sm">
                      {domain.verification_token}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(domain.verification_token || '')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleVerify} disabled={verifying} className="w-full">
                  <RefreshCw className={`h-4 w-4 mr-2 ${verifying ? 'animate-spin' : ''}`} />
                  {verifying ? 'Verifying...' : 'Verify Domain'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ssl">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">SSL Certificate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge className={domain.ssl_status === 'active' ? 'bg-green-100 text-green-800' : ''}>
                    {domain.ssl_status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Provider:</span>
                  <span className="font-medium">{domain.ssl_provider}</span>
                </div>
                {domain.ssl_expires_at && (
                  <div className="flex items-center justify-between">
                    <span>Expires:</span>
                    <span>{new Date(domain.ssl_expires_at).toLocaleDateString()}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  SSL certificates are automatically provisioned and renewed via Let's Encrypt
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}
