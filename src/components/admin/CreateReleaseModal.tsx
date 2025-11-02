import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CreateReleaseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateReleaseModal({ onClose, onSuccess }: CreateReleaseModalProps) {
  const [version, setVersion] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [platform, setPlatform] = useState('');
  const [changelog, setChangelog] = useState('');
  const [crashThreshold, setCrashThreshold] = useState('5.0');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('releases').insert({
        version,
        build_number: parseInt(buildNumber),
        platform,
        changelog,
        crash_threshold: parseFloat(crashThreshold),
        status: 'pending_approval',
        created_by: user?.id
      });

      if (error) throw error;

      toast({
        title: 'Release created',
        description: `Version ${version} is pending approval`
      });

      onSuccess();
      onClose();
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Release</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Version</Label>
              <Input
                placeholder="1.2.3"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Build Number</Label>
              <Input
                type="number"
                placeholder="123"
                value={buildNumber}
                onChange={(e) => setBuildNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Crash Threshold (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={crashThreshold}
                onChange={(e) => setCrashThreshold(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Changelog</Label>
            <Textarea
              placeholder="What's new in this release..."
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Release'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
