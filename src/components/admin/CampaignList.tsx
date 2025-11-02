import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Play, Pause, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CampaignListProps {
  campaigns: any[];
  loading: boolean;
  onViewDetails: (campaign: any) => void;
  onRefresh: () => void;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500',
  scheduled: 'bg-blue-500',
  sending: 'bg-yellow-500',
  sent: 'bg-green-500',
  paused: 'bg-orange-500',
  cancelled: 'bg-red-500',
  failed: 'bg-red-600'
};

export default function CampaignList({ campaigns, loading, onViewDetails, onRefresh }: CampaignListProps) {
  if (loading) {
    return <Card className="p-8 text-center">Loading campaigns...</Card>;
  }

  if (campaigns.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No campaigns yet</p>
        <p className="text-sm text-muted-foreground">Create your first campaign to get started</p>
      </Card>
    );
  }

  const calculateOpenRate = (campaign: any) => {
    if (!campaign.total_sent) return '0%';
    return `${((campaign.total_opened / campaign.total_sent) * 100).toFixed(1)}%`;
  };

  const calculateClickRate = (campaign: any) => {
    if (!campaign.total_sent) return '0%';
    return `${((campaign.total_clicked / campaign.total_sent) * 100).toFixed(1)}%`;
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Open Rate</TableHead>
            <TableHead>Click Rate</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">{campaign.subject_line}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[campaign.status]}>
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>
                {campaign.total_sent > 0 ? campaign.total_sent : campaign.estimated_recipients}
              </TableCell>
              <TableCell>
                {campaign.scheduled_at ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(campaign.scheduled_at), 'MMM d, yyyy h:mm a')}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not scheduled</span>
                )}
              </TableCell>
              <TableCell>{calculateOpenRate(campaign)}</TableCell>
              <TableCell>{calculateClickRate(campaign)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewDetails(campaign)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
