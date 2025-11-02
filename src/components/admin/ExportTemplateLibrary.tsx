import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Eye, Play, Share2, Trash2, Users, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { ApplyTemplateModal } from './ApplyTemplateModal';
import { ShareTemplateModal } from './ShareTemplateModal';
import { TemplateAnalyticsDashboard } from './TemplateAnalyticsDashboard';

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  export_format: string;
  filters: any;
  include_analytics: boolean;
  email_recipients: string[];
  is_public: boolean;
  usage_count: number;
  last_used_at: string;
  created_at: string;
}

export function ExportTemplateLibrary() {
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ExportTemplate | null>(null);
  const [applyTemplate, setApplyTemplate] = useState<ExportTemplate | null>(null);
  const [shareTemplate, setShareTemplate] = useState<ExportTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-export-templates', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (templateId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-export-templates', {
        body: { action: 'clone', templateId }
      });

      if (error) throw error;
      toast.success('Template cloned successfully');
      loadTemplates();
    } catch (error: any) {
      toast.error('Failed to clone template');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase.functions.invoke('manage-export-templates', {
        body: { action: 'delete', templateId }
      });

      if (error) throw error;
      toast.success('Template deleted');
      loadTemplates();
    } catch (error: any) {
      toast.error('Failed to delete template');
    }
  };

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const categoryLabels = {
    daily_reports: 'Daily Reports',
    weekly_summaries: 'Weekly Summaries',
    monthly_analytics: 'Monthly Analytics',
    custom: 'Custom'
  };

  if (showAnalytics) {
    return <TemplateAnalyticsDashboard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Export Template Library</h2>
          <p className="text-muted-foreground">Save and reuse export configurations</p>
        </div>
        <Button onClick={() => setShowAnalytics(true)} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="daily_reports">Daily Reports</TabsTrigger>
          <TabsTrigger value="weekly_summaries">Weekly Summaries</TabsTrigger>
          <TabsTrigger value="monthly_analytics">Monthly Analytics</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {loading ? (
            <div className="text-center py-12">Loading templates...</div>
          ) : filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No templates found in this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.is_public && (
                        <Badge variant="secondary">
                          <Users className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <Badge variant="outline">{template.export_format.toUpperCase()}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{categoryLabels[template.category as keyof typeof categoryLabels]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>Used {template.usage_count} times</span>
                      </div>
                      {template.last_used_at && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Last used {new Date(template.last_used_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button size="sm" onClick={() => setPreviewTemplate(template)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="default" onClick={() => setApplyTemplate(template)}>
                      <Play className="w-4 h-4 mr-1" />
                      Apply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleClone(template.id)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShareTemplate(template)}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          open={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      {applyTemplate && (
        <ApplyTemplateModal
          template={applyTemplate}
          open={!!applyTemplate}
          onClose={() => setApplyTemplate(null)}
          onSuccess={loadTemplates}
        />
      )}

      {shareTemplate && (
        <ShareTemplateModal
          template={shareTemplate}
          open={!!shareTemplate}
          onClose={() => setShareTemplate(null)}
        />
      )}
    </div>
  );
}