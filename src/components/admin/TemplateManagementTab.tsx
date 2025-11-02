import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Eye, Send, History, Trash2 } from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreview } from './TemplatePreview';
import { TemplateVersionHistory } from './TemplateVersionHistory';
import { TemplateTestModal } from './TemplateTestModal';

interface Template {
  id: string;
  name: string;
  description: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
  category: string;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export function TemplateManagementTab() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [mode, setMode] = useState<'list' | 'edit' | 'preview' | 'history' | 'test'>('list');
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-email-templates', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setTemplates(data || []);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase.functions.invoke('manage-email-templates', {
        body: { action: 'delete', template: { id } }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Template deleted successfully'
      });
      loadTemplates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (mode === 'edit') {
    return (
      <TemplateEditor
        template={selectedTemplate}
        onSave={() => {
          setMode('list');
          loadTemplates();
        }}
        onCancel={() => setMode('list')}
      />
    );
  }

  if (mode === 'preview' && selectedTemplate) {
    return (
      <TemplatePreview
        template={selectedTemplate}
        onClose={() => setMode('list')}
      />
    );
  }

  if (mode === 'history' && selectedTemplate) {
    return (
      <TemplateVersionHistory
        templateId={selectedTemplate.id}
        onClose={() => setMode('list')}
      />
    );
  }

  if (mode === 'test' && selectedTemplate) {
    return (
      <TemplateTestModal
        template={selectedTemplate}
        onClose={() => setMode('list')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">Create and manage reusable email templates</p>
        </div>
        <Button onClick={() => {
          setSelectedTemplate(null);
          setMode('edit');
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading templates...</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No templates yet</p>
            <Button onClick={() => {
              setSelectedTemplate(null);
              setMode('edit');
            }}>
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedTemplate(template);
                    setMode('edit');
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedTemplate(template);
                    setMode('preview');
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedTemplate(template);
                    setMode('test');
                  }}>
                    <Send className="mr-2 h-4 w-4" />
                    Test
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedTemplate(template);
                    setMode('history');
                  }}>
                    <History className="mr-2 h-4 w-4" />
                    History
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
