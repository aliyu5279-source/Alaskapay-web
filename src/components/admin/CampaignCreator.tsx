import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CampaignCreatorProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CampaignCreator({ onBack, onSuccess }: CampaignCreatorProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_id: '',
    subject_line: '',
    from_name: 'Alaska Pay',
    from_email: 'noreply@alaskapay.com',
    scheduled_at: '',
    send_immediately: false,
    segment_id: ''
  });
  const [filters, setFilters] = useState({
    userStatus: '',
    registeredAfter: '',
    registeredBefore: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
    loadSegments();
  }, []);

  const loadSegments = async () => {
    const { data } = await supabase.functions.invoke('manage-segments', {
      body: { action: 'list' }
    });
    if (data) {
      setSegments(data);
    }
  };


  const loadTemplates = async () => {
    const { data } = await supabase.functions.invoke('manage-email-templates', {
      body: { action: 'list' }
    });
    if (data?.templates) {
      setTemplates(data.templates.filter((t: any) => t.status === 'active'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('manage-campaigns', {
        body: {
          action: 'create',
          campaignData: formData,
          filters
        }
      });

      if (error) throw error;

      toast({
        title: 'Campaign Created',
        description: 'Your campaign has been created successfully.'
      });
      onSuccess();
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-3xl font-bold">Create Campaign</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Campaign Details</h3>
          
          <div>
            <Label>Campaign Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label>Email Template</Label>
            <Select value={formData.template_id} onValueChange={(v) => setFormData({ ...formData, template_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Subject Line</Label>
            <Input
              value={formData.subject_line}
              onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
              required
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Recipients</h3>
          
          <div>
            <Label>User Segment (Optional)</Label>
            <Select value={formData.segment_id} onValueChange={(v) => setFormData({ ...formData, segment_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select segment or use filters" />
              </SelectTrigger>
              <SelectContent>
                {segments.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} ({s.user_count} users)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>User Status</Label>
            <Select value={filters.userStatus} onValueChange={(v) => setFilters({ ...filters, userStatus: v })}>
              <SelectTrigger>
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Registered After</Label>
            <Input
              type="date"
              value={filters.registeredAfter}
              onChange={(e) => setFilters({ ...filters, registeredAfter: e.target.value })}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Schedule</h3>
          <div>
            <Label>Send Date & Time</Label>
            <Input
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            />
          </div>
        </Card>


        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
