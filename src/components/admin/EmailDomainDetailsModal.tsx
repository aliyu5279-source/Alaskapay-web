import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Send, CheckCircle, XCircle } from 'lucide-react';
import { validateDNSRecords, testEmailDeliverability } from '@/lib/emailDomainService';
import EmailWarmupDashboard from './EmailWarmupDashboard';
import DomainHealthPanel from './DomainHealthPanel';
import { toast } from 'sonner';


interface EmailDomainDetailsModalProps {
  domain: any;
  onClose: () => void;
  onUpdate: () => void;
}

export function EmailDomainDetailsModal({ domain, onClose, onUpdate }: EmailDomainDetailsModalProps) {
  const [validating, setValidating] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleValidate = async () => {
    setValidating(true);
    const results = await validateDNSRecords(domain.id);
    toast.success('DNS validation completed');
    onUpdate();
    setValidating(false);
  };

  const handleTest = async () => {
    if (!testEmail) return;
    setTesting(true);
    const { error } = await testEmailDeliverability(domain.id, testEmail);
    if (error) {
      toast.error('Failed to start deliverability test');
    } else {
      toast.success('Deliverability test started');
    }
    setTesting(false);
  };

  const DNSRecordCard = ({ title, record, status }: any) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">{title}</CardTitle>
          <Badge variant={status === 'verified' ? 'default' : 'secondary'}>
            {status === 'verified' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-3 rounded-md font-mono text-xs break-all">
          {record}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => copyToClipboard(record)}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy Record
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{domain.domain}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dns">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dns">DNS Records</TabsTrigger>
            <TabsTrigger value="warmup">Warmup</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>


          <TabsContent value="dns" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleValidate} disabled={validating}>
                <RefreshCw className={`w-4 h-4 mr-2 ${validating ? 'animate-spin' : ''}`} />
                Validate DNS
              </Button>
            </div>

            <DNSRecordCard
              title="SPF Record"
              record={domain.spf_record}
              status={domain.spf_status}
            />

            <DNSRecordCard
              title="DKIM Record"
              record={domain.dkim_record}
              status={domain.dkim_status}
            />

            <DNSRecordCard
              title="DMARC Record"
              record={domain.dmarc_record}
              status={domain.dmarc_status}
            />
          </TabsContent>

          <TabsContent value="warmup" className="space-y-4">
            <DomainHealthPanel domainId={domain.id} />
            <EmailWarmupDashboard domainId={domain.id} />
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Email Deliverability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-email">Test Email Address</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleTest} disabled={testing || !testEmail}>
                  <Send className="w-4 h-4 mr-2" />
                  {testing ? 'Testing...' : 'Send Test Email'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reputation">
            <Card>
              <CardHeader>
                <CardTitle>Domain Reputation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Reputation Score</p>
                    <p className="text-2xl font-bold">{domain.reputation_score}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                    <p className="text-2xl font-bold">{domain.bounce_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Complaint Rate</p>
                    <p className="text-2xl font-bold">{domain.complaint_rate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Validation History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No validation history yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
