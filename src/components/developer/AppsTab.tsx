import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Plus, Smartphone, Globe, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AppsTab() {
  const [apps, setApps] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    platform: 'ios',
    bundleId: '',
    webhookUrl: ''
  });

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    const { data: account } = await supabase
      .from('developer_accounts')
      .select('id')
      .single();
    
    if (account) {
      const { data } = await supabase
        .from('developer_apps')
        .select('*')
        .eq('developer_account_id', account.id)
        .order('created_at', { ascending: false });
      
      setApps(data || []);
    }
  };

  const createApp = async () => {
    const { data: account } = await supabase
      .from('developer_accounts')
      .select('id')
      .single();

    if (account) {
      await supabase.from('developer_apps').insert({
        developer_account_id: account.id,
        app_name: newApp.name,
        app_description: newApp.description,
        platform: newApp.platform,
        bundle_id: newApp.bundleId,
        webhook_url: newApp.webhookUrl
      });

      setShowCreateModal(false);
      setNewApp({ name: '', description: '', platform: 'ios', bundleId: '', webhookUrl: '' });
      loadApps();
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
      case 'android':
        return <Smartphone className="h-5 w-5" />;
      case 'web':
        return <Globe className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Applications</h2>
          <p className="text-gray-600">Manage your integrated applications</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <Card key={app.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getPlatformIcon(app.platform)}
                <div>
                  <h3 className="font-semibold">{app.app_name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {app.platform}
                  </Badge>
                </div>
              </div>
              <Badge variant={app.status === 'production' ? 'default' : 'secondary'}>
                {app.status}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{app.app_description}</p>
            
            <div className="space-y-2 text-sm">
              {app.bundle_id && (
                <div>
                  <span className="text-gray-600">Bundle ID:</span>
                  <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{app.bundle_id}</code>
                </div>
              )}
              {app.webhook_url && (
                <div>
                  <span className="text-gray-600">Webhook:</span>
                  <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded break-all">{app.webhook_url}</code>
                </div>
              )}
              <div className="text-gray-500 text-xs mt-3">
                Created {new Date(app.created_at).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {apps.length === 0 && (
        <Card className="p-12 text-center">
          <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="font-semibold mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-4">Create your first application to get started</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </Card>
      )}

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>App Name</Label>
              <Input 
                placeholder="My Awesome App"
                value={newApp.name}
                onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Brief description of your app"
                value={newApp.description}
                onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Platform</Label>
              <Select value={newApp.platform} onValueChange={(v) => setNewApp({ ...newApp, platform: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Bundle ID / Package Name</Label>
              <Input 
                placeholder="com.example.app"
                value={newApp.bundleId}
                onChange={(e) => setNewApp({ ...newApp, bundleId: e.target.value })}
              />
            </div>
            <div>
              <Label>Webhook URL (Optional)</Label>
              <Input 
                placeholder="https://yourapp.com/webhook"
                value={newApp.webhookUrl}
                onChange={(e) => setNewApp({ ...newApp, webhookUrl: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={createApp}>
              Create Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
