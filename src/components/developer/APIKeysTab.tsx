import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Plus, Copy, Eye, EyeOff, Trash2, Key } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function APIKeysTab() {
  const [keys, setKeys] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState({ name: '', environment: 'sandbox', rateLimit: 100 });
  const [generatedKey, setGeneratedKey] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    const { data: account } = await supabase
      .from('developer_accounts')
      .select('id')
      .single();
    
    if (account) {
      const { data } = await supabase
        .from('api_keys')
        .select('*')
        .eq('developer_account_id', account.id)
        .order('created_at', { ascending: false });
      
      setKeys(data || []);
    }
  };

  const createAPIKey = async () => {
    const prefix = newKey.environment === 'production' ? 'ak_live_' : 'ak_test_';
    const key = prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const { data: account } = await supabase
      .from('developer_accounts')
      .select('id')
      .single();

    if (account) {
      await supabase.from('api_keys').insert({
        developer_account_id: account.id,
        key_name: newKey.name,
        key_prefix: prefix,
        key_hash: key,
        environment: newKey.environment,
        rate_limit: newKey.rateLimit
      });

      setGeneratedKey(key);
      loadAPIKeys();
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteKey = async (keyId: string) => {
    await supabase.from('api_keys').delete().eq('id', keyId);
    loadAPIKeys();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-gray-600">Manage your API keys for different environments</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <div className="grid gap-4">
        {keys.map((key) => (
          <Card key={key.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold">{key.key_name}</h3>
                  <Badge variant={key.environment === 'production' ? 'default' : 'secondary'}>
                    {key.environment}
                  </Badge>
                  {key.is_active ? (
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600">Inactive</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                    {visibleKeys.has(key.id) ? key.key_hash : '••••••••••••••••••••••••••••••••'}
                  </code>
                  <Button size="sm" variant="ghost" onClick={() => toggleKeyVisibility(key.id)}>
                    {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(key.key_hash)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  Rate Limit: {key.rate_limit} req/min | Created: {new Date(key.created_at).toLocaleDateString()}
                  {key.last_used_at && ` | Last used: ${new Date(key.last_used_at).toLocaleDateString()}`}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteKey(key.id)}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          {generatedKey ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  Save this key securely - it won't be shown again!
                </p>
                <code className="block bg-white p-3 rounded text-sm break-all">
                  {generatedKey}
                </code>
                <Button className="mt-3 w-full" onClick={() => copyToClipboard(generatedKey)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
              <Button className="w-full" onClick={() => { setShowCreateModal(false); setGeneratedKey(''); }}>
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Key Name</Label>
                <Input 
                  placeholder="My App Production Key"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Environment</Label>
                <Select value={newKey.environment} onValueChange={(v) => setNewKey({ ...newKey, environment: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rate Limit (requests/minute)</Label>
                <Input 
                  type="number"
                  value={newKey.rateLimit}
                  onChange={(e) => setNewKey({ ...newKey, rateLimit: parseInt(e.target.value) })}
                />
              </div>
              <Button className="w-full" onClick={createAPIKey}>
                Generate API Key
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
