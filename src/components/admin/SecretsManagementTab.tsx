import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Key, Eye, EyeOff, RotateCw, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { secretsService, EnvironmentSecret } from '@/services/secretsService';
import { AddSecretModal } from './AddSecretModal';
import { EditSecretModal } from './EditSecretModal';
import { ViewSecretModal } from './ViewSecretModal';
import { RotateSecretModal } from './RotateSecretModal';
import { toast } from 'sonner';

export function SecretsManagementTab() {
  const [secrets, setSecrets] = useState<EnvironmentSecret[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSecret, setEditingSecret] = useState<EnvironmentSecret | null>(null);
  const [viewingSecret, setViewingSecret] = useState<EnvironmentSecret | null>(null);
  const [rotatingSecret, setRotatingSecret] = useState<EnvironmentSecret | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Secrets' },
    { value: 'deployment', label: 'Deployment' },
    { value: 'database', label: 'Database' },
    { value: 'payment', label: 'Payment' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadSecrets();
  }, []);

  const loadSecrets = async () => {
    try {
      const data = await secretsService.listSecrets();
      setSecrets(data);
    } catch (error) {
      toast.error('Failed to load secrets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this secret?')) return;

    try {
      await secretsService.deleteSecret(id);
      toast.success('Secret deleted successfully');
      loadSecrets();
    } catch (error) {
      toast.error('Failed to delete secret');
    }
  };

  const filteredSecrets = selectedCategory === 'all' 
    ? secrets 
    : secrets.filter(s => s.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      deployment: 'bg-blue-500',
      database: 'bg-green-500',
      payment: 'bg-purple-500',
      email: 'bg-orange-500',
      sms: 'bg-pink-500',
      other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Environment Secrets</h2>
          <p className="text-muted-foreground">Manage API keys and credentials securely</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Secret
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card><CardContent className="p-8 text-center">Loading...</CardContent></Card>
        ) : filteredSecrets.length === 0 ? (
          <Card><CardContent className="p-8 text-center">No secrets found</CardContent></Card>
        ) : (
          filteredSecrets.map(secret => (
            <Card key={secret.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{secret.key_name}</CardTitle>
                      <CardDescription>{secret.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(secret.category)}>
                      {secret.category}
                    </Badge>
                    {secret.is_active ? (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(secret.updated_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingSecret(secret)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSecret(secret)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRotatingSecret(secret)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(secret.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showAddModal && (
        <AddSecretModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadSecrets();
          }}
        />
      )}

      {editingSecret && (
        <EditSecretModal
          secret={editingSecret}
          onClose={() => setEditingSecret(null)}
          onSuccess={() => {
            setEditingSecret(null);
            loadSecrets();
          }}
        />
      )}

      {viewingSecret && (
        <ViewSecretModal
          secret={viewingSecret}
          onClose={() => setViewingSecret(null)}
        />
      )}

      {rotatingSecret && (
        <RotateSecretModal
          secret={rotatingSecret}
          onClose={() => setRotatingSecret(null)}
          onSuccess={() => {
            setRotatingSecret(null);
            loadSecrets();
          }}
        />
      )}
    </div>
  );
}