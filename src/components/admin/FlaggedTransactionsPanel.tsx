import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function FlaggedTransactionsPanel() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('transaction_fraud_flags')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlags(data || []);
    } catch (error) {
      console.error('Error loading flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const reviewFlag = async (status: string) => {
    try {
      const { error } = await supabase.functions.invoke('review-fraud-flag', {
        body: {
          flagId: selectedFlag.id,
          status,
          reviewNotes
        }
      });

      if (error) throw error;
      toast.success('Flag reviewed successfully');
      setSelectedFlag(null);
      setReviewNotes('');
      loadFlags();
    } catch (error) {
      toast.error('Failed to review flag');
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      reviewing: { icon: AlertTriangle, color: 'bg-blue-100 text-blue-800' },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800' },
      false_positive: { icon: CheckCircle, color: 'bg-gray-100 text-gray-800' }
    };
    const variant = variants[status] || variants.pending;
    const Icon = variant.icon;
    return (
      <Badge className={variant.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Flagged Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flags.map((flag) => (
              <Card key={flag.id} className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedFlag(flag)}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full font-bold ${getRiskColor(flag.risk_score)}`}>
                          Risk: {flag.risk_score}
                        </div>
                        {getStatusBadge(flag.status)}
                      </div>
                      <p className="font-semibold mb-1">
                        {flag.profiles?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {flag.flag_reason}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(flag.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedFlag} onOpenChange={() => setSelectedFlag(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Fraud Flag</DialogTitle>
          </DialogHeader>
          {selectedFlag && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">User</label>
                  <p>{selectedFlag.profiles?.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Risk Score</label>
                  <p className="font-bold">{selectedFlag.risk_score}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <p>{selectedFlag.flag_reason}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add your review notes..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => reviewFlag('approved')} variant="default">
                  Approve
                </Button>
                <Button onClick={() => reviewFlag('rejected')} variant="destructive">
                  Reject
                </Button>
                <Button onClick={() => reviewFlag('false_positive')} variant="outline">
                  False Positive
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
