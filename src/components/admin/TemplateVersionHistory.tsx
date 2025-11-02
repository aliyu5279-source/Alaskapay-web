import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { emailTemplateService } from '@/lib/emailTemplateService';
import { History, RotateCcw, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface TemplateVersionHistoryProps {
  templateId: string;
  onClose: () => void;
  onRollback?: () => void;
}

export function TemplateVersionHistory({ templateId, onClose, onRollback }: TemplateVersionHistoryProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVersions();
  }, [templateId]);

  const loadVersions = async () => {
    try {
      const data = await emailTemplateService.getVersionHistory(templateId);
      setVersions(data);
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

  const handleRollback = async (versionId: string) => {
    if (!confirm('Are you sure you want to rollback to this version?')) return;

    try {
      await emailTemplateService.rollbackToVersion(templateId, versionId);
      toast({
        title: 'Success',
        description: 'Template rolled back successfully'
      });
      onRollback?.();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading version history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6" />
          Version History
        </h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <div className="space-y-3">
        {versions.map((version, index) => (
          <Card key={version.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Version {version.version}
                    {index === 0 && <Badge className="ml-2">Current</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(version.created_at), 'PPpp')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVersion(version)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {index !== 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleRollback(version.id)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Rollback
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            {selectedVersion?.id === version.id && (
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Subject:</strong> {version.subject}
                  </div>
                  <div>
                    <strong>Variables:</strong> {version.variables?.join(', ') || 'None'}
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded">
                    <div dangerouslySetInnerHTML={{ __html: version.html_content }} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
