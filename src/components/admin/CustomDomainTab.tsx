import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, CheckCircle, AlertCircle, Clock, Settings } from 'lucide-react';
import { domainService, CustomDomain } from '@/lib/domainService';
import { AddDomainModal } from './AddDomainModal';
import { DomainDetailsModal } from './DomainDetailsModal';

export function CustomDomainTab() {
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<CustomDomain | null>(null);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const data = await domainService.getDomains();
      setDomains(data);
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'verified': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Custom Domains</h2>
          <p className="text-muted-foreground">Manage custom domains for your application</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </div>

      <div className="grid gap-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{domain.full_domain}</h3>
                      {getStatusIcon(domain.status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{domain.domain_type}</Badge>
                      <Badge className={getStatusColor(domain.status)}>
                        {domain.status}
                      </Badge>
                      {domain.ssl_status === 'active' && (
                        <Badge className="bg-green-100 text-green-800">SSL Active</Badge>
                      )}
                    </div>
                    {domain.registrar && (
                      <p className="text-sm text-muted-foreground">
                        Registrar: {domain.registrar}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDomain(domain)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {domains.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No custom domains</h3>
              <p className="text-muted-foreground mb-4">
                Add a custom domain to use your own branding
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Domain
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {showAddModal && (
        <AddDomainModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadDomains();
          }}
        />
      )}

      {selectedDomain && (
        <DomainDetailsModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
          onUpdate={loadDomains}
        />
      )}
    </div>
  );
}
