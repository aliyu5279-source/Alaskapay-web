import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AddEmailDomainModal } from './AddEmailDomainModal';
import { EmailDomainDetailsModal } from './EmailDomainDetailsModal';
import EmailWarmupDashboard from './EmailWarmupDashboard';
import DomainHealthPanel from './DomainHealthPanel';
import { toast } from 'sonner';


export function EmailDomainAuthTab() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_sending_domains')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load email domains');
    } else {
      setDomains(data || []);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      verified: { variant: 'default', icon: CheckCircle, color: 'text-green-500' },
      pending: { variant: 'secondary', icon: AlertCircle, color: 'text-yellow-500' },
      failed: { variant: 'destructive', icon: XCircle, color: 'text-red-500' }
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant}>
        <Icon className={`w-3 h-3 mr-1 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Domain Authentication</h2>
          <p className="text-muted-foreground">Configure SPF, DKIM, and DMARC for custom sending domains</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Domain
        </Button>
      </div>

      <div className="grid gap-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedDomain(domain)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{domain.domain}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Added {new Date(domain.created_at).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(domain.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">SPF</p>
                  {getStatusBadge(domain.spf_status)}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">DKIM</p>
                  {getStatusBadge(domain.dkim_status)}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">DMARC</p>
                  {getStatusBadge(domain.dmarc_status)}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Reputation Score: <strong>{domain.reputation_score}/100</strong></span>
                  <span>Bounce Rate: <strong>{domain.bounce_rate}%</strong></span>
                  <span>Complaint Rate: <strong>{domain.complaint_rate}%</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddModal && (
        <AddEmailDomainModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadDomains();
          }}
        />
      )}

      {selectedDomain && (
        <EmailDomainDetailsModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
          onUpdate={loadDomains}
        />
      )}
    </div>
  );
}
