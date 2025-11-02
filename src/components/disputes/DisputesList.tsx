import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface DisputesListProps {
  onSelectDispute: (dispute: any) => void;
}

export function DisputesList({ onSelectDispute }: DisputesListProps) {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transaction_disputes')
        .select(`
          *,
          transactions(description, type, created_at),
          dispute_messages(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDisputes(data || []);
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      under_review: 'bg-blue-500',
      investigating: 'bg-purple-500',
      resolved: 'bg-green-500',
      rejected: 'bg-red-500',
      refunded: 'bg-emerald-500',
      closed: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="text-center py-8">Loading disputes...</div>;
  }

  if (disputes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Disputes</h3>
        <p className="text-muted-foreground">You haven't created any disputes yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <Card key={dispute.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectDispute(dispute)}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold">{dispute.reason}</h3>
              <p className="text-sm text-muted-foreground">
                {dispute.transactions?.description}
              </p>
            </div>
            <Badge className={getStatusColor(dispute.status)}>
              {dispute.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                ₦{dispute.amount?.toLocaleString()}
              </span>
              <span className="text-muted-foreground">
                {format(new Date(dispute.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>

          {dispute.resolution_notes && (
            <div className="mt-2 p-2 bg-muted rounded text-sm">
              <strong>Resolution:</strong> {dispute.resolution_notes}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
