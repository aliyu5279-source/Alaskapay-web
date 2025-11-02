import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { SegmentBuilder } from './SegmentBuilder';
import { Plus, Users, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SegmentsTab() {
  const [segments, setSegments] = useState<any[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [previewUsers, setPreviewUsers] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-segments', {
        body: { action: 'list' }
      });
      if (error) throw error;
      setSegments(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveSegment = async (segmentData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-segments', {
        body: { action: 'create', segmentData }
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'Segment created successfully' });
      setShowBuilder(false);
      loadSegments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (segment: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('evaluate-segment', {
        body: { segmentId: segment.id, previewOnly: true, limit: 10 }
      });
      if (error) throw error;
      setPreviewUsers(data.users || []);
      setShowPreview(true);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (segmentId: string) => {
    try {
      await supabase.functions.invoke('evaluate-segment', {
        body: { segmentId, previewOnly: false }
      });
      toast({ title: 'Success', description: 'Segment refreshed' });
      loadSegments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (segmentId: string) => {
    try {
      await supabase.functions.invoke('manage-segments', {
        body: { action: 'delete', segmentId }
      });
      toast({ title: 'Success', description: 'Segment deleted' });
      loadSegments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Segments</h2>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Segment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell className="font-medium">{segment.name}</TableCell>
                  <TableCell>{segment.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {segment.user_count}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(segment.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(segment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRefresh(segment.id)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(segment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create User Segment</DialogTitle>
          </DialogHeader>
          <SegmentBuilder onSave={handleSaveSegment} />
        </DialogContent>
      </Dialog>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Segment Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {previewUsers.map((user) => (
              <div key={user.id} className="p-2 border rounded">
                <div className="font-medium">{user.full_name || user.email}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
