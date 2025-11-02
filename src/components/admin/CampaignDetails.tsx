import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Pause, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CampaignDetailsProps {
  campaign: any;
  onBack: () => void;
}

export default function CampaignDetails({ campaign, onBack }: CampaignDetailsProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendNow = async () => {
    if (!confirm('Send this campaign now?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-campaign', {
        body: { campaignId: campaign.id }
      });

      if (error) throw error;

      toast({
        title: 'Campaign Sent',
        description: 'Your campaign is being sent to recipients.'
      });
      onBack();
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

  const metrics = [
    { name: 'Sent', value: campaign.total_sent || 0 },
    { name: 'Delivered', value: campaign.total_delivered || 0 },
    { name: 'Opened', value: campaign.total_opened || 0 },
    { name: 'Clicked', value: campaign.total_clicked || 0 },
    { name: 'Bounced', value: campaign.total_bounced || 0 }
  ];

  const openRate = campaign.total_sent > 0 
    ? ((campaign.total_opened / campaign.total_sent) * 100).toFixed(1)
    : '0';
  
  const clickRate = campaign.total_sent > 0
    ? ((campaign.total_clicked / campaign.total_sent) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">{campaign.name}</h2>
            <p className="text-muted-foreground">{campaign.subject_line}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'draft' && (
            <Button onClick={handleSendNow} disabled={loading}>
              <Send className="w-4 h-4 mr-2" />
              Send Now
            </Button>
          )}
          <Badge>{campaign.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Recipients</div>
          <div className="text-3xl font-bold">{campaign.estimated_recipients}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Sent</div>
          <div className="text-3xl font-bold">{campaign.total_sent || 0}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Open Rate</div>
          <div className="text-3xl font-bold">{openRate}%</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Click Rate</div>
          <div className="text-3xl font-bold">{clickRate}%</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Campaign Details</h3>
        <div className="space-y-2">
          <div><span className="font-medium">Description:</span> {campaign.description}</div>
          <div><span className="font-medium">From:</span> {campaign.from_name} ({campaign.from_email})</div>
          <div><span className="font-medium">Created:</span> {new Date(campaign.created_at).toLocaleString()}</div>
          {campaign.scheduled_at && (
            <div><span className="font-medium">Scheduled:</span> {new Date(campaign.scheduled_at).toLocaleString()}</div>
          )}
        </div>
      </Card>
    </div>
  );
}
