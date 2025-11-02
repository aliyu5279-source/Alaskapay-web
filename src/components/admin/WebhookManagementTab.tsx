import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { WebhookList } from './WebhookList';
import { WebhookDeliveryLogs } from './WebhookDeliveryLogs';
import { WebhookStatistics } from './WebhookStatistics';
import { CreateWebhookModal } from './CreateWebhookModal';

export function WebhookManagementTab() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWebhookCreated = () => {
    setShowCreateModal(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Webhook Management</h2>
          <p className="text-muted-foreground">
            Configure webhooks for fraud alerts, transactions, and KYC updates
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <WebhookList key={refreshKey} onUpdate={() => setRefreshKey(prev => prev + 1)} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <WebhookDeliveryLogs />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <WebhookStatistics />
        </TabsContent>
      </Tabs>

      <CreateWebhookModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleWebhookCreated}
      />
    </div>
  );
}
