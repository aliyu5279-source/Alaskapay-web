import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { submitRegulatoryReport, retrySubmission } from '@/lib/regulatorySubmission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Send, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

export function RegulatorySubmissionsTab() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('regulatory_submissions')
      .select('*, regulatory_reports(*)')
      .order('created_at', { ascending: false })
      .limit(50);
    setSubmissions(data || []);
    setLoading(false);
  };

  const handleSubmit = async (reportId: string, body: string, type: string) => {
    setSubmitting(reportId);
    const result = await submitRegulatoryReport(reportId, body as any, type);
    
    if (result.success) {
      toast({
        title: 'Submission Successful',
        description: `Reference: ${result.referenceNumber}`
      });
      loadSubmissions();
    } else {
      toast({
        title: 'Submission Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
    setSubmitting(null);
  };

  const handleRetry = async (submissionId: string) => {
    setSubmitting(submissionId);
    const result = await retrySubmission(submissionId);
    
    if (result.success) {
      toast({ title: 'Retry Successful' });
      loadSubmissions();
    } else {
      toast({
        title: 'Retry Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
    setSubmitting(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'secondary',
      submitted: 'default',
      confirmed: 'default',
      failed: 'destructive',
      retrying: 'secondary'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <RefreshCw className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Regulatory Submissions</h2>
        <Button onClick={loadSubmissions} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    {submission.regulatory_body} - {submission.submission_type}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submitted: {new Date(submission.submission_date).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(submission.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submission.submission_reference && (
                  <div>
                    <p className="text-sm font-medium">Reference Number</p>
                    <p className="text-sm text-muted-foreground">{submission.submission_reference}</p>
                  </div>
                )}

                {submission.error_message && (
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-sm text-red-800">{submission.error_message}</p>
                  </div>
                )}

                {submission.retry_count > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Retry attempts: {submission.retry_count}
                  </p>
                )}

                <div className="flex gap-2">
                  {submission.status === 'failed' && (
                    <Button
                      size="sm"
                      onClick={() => handleRetry(submission.id)}
                      disabled={submitting === submission.id}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${submitting === submission.id ? 'animate-spin' : ''}`} />
                      Retry
                    </Button>
                  )}
                  
                  {submission.confirmation_receipt && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}