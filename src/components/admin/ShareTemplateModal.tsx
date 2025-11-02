import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { X, UserPlus } from 'lucide-react';

interface ShareTemplateModalProps {
  template: any;
  open: boolean;
  onClose: () => void;
}

export function ShareTemplateModal({ template, open, onClose }: ShareTemplateModalProps) {
  const [email, setEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [shares, setShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(template.is_public);

  useEffect(() => {
    if (open) {
      loadShares();
    }
  }, [open]);

  const loadShares = async () => {
    try {
      const { data, error } = await supabase
        .from('template_shares')
        .select(`
          *,
          user:profiles!template_shares_shared_with_fkey(full_name, email)
        `)
        .eq('template_id', template.id);

      if (error) throw error;
      setShares(data || []);
    } catch (error: any) {
      console.error('Failed to load shares:', error);
    }
  };

  const handleShare = async () => {
    if (!email) return;

    setLoading(true);
    try {
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        toast.error('User not found');
        return;
      }

      const { error } = await supabase.functions.invoke('manage-export-templates', {
        body: {
          action: 'share',
          templateId: template.id,
          templateData: {
            sharedWith: userData.id,
            canEdit
          }
        }
      });

      if (error) throw error;

      toast.success('Template shared successfully');
      setEmail('');
      setCanEdit(false);
      loadShares();
    } catch (error: any) {
      toast.error('Failed to share template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnshare = async (shareId: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-export-templates', {
        body: {
          action: 'unshare',
          templateId: template.id,
          templateData: { shareId }
        }
      });

      if (error) throw error;

      toast.success('Share removed');
      loadShares();
    } catch (error: any) {
      toast.error('Failed to remove share');
    }
  };

  const handleTogglePublic = async () => {
    try {
      const { error } = await supabase.functions.invoke('manage-export-templates', {
        body: {
          action: 'update',
          templateId: template.id,
          templateData: { is_public: !isPublic }
        }
      });

      if (error) throw error;

      setIsPublic(!isPublic);
      toast.success(isPublic ? 'Template is now private' : 'Template is now public');
    } catch (error: any) {
      toast.error('Failed to update template');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Template</DialogTitle>
          <DialogDescription>
            Share "{template.name}" with other users or make it public
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Public Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <Label>Make Public</Label>
              <p className="text-xs text-muted-foreground">Allow all users to view this template</p>
            </div>
            <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
          </div>

          {/* Share with specific users */}
          <div className="space-y-3">
            <Label>Share with specific users</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleShare()}
              />
              <Button onClick={handleShare} disabled={loading || !email} size="icon">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={canEdit} onCheckedChange={setCanEdit} id="can-edit" />
              <Label htmlFor="can-edit" className="text-sm">Allow editing</Label>
            </div>
          </div>

          {/* Current shares */}
          {shares.length > 0 && (
            <div className="space-y-2">
              <Label>Shared with ({shares.length})</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {shares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{share.user?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{share.user?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {share.can_edit && <Badge variant="secondary">Can Edit</Badge>}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleUnshare(share.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}