import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, FileText, User, MapPin, Shield } from 'lucide-react';
import { KYCVerificationBadge } from '../kyc/KYCVerificationBadge';

export function KYCReviewTab() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select('*, profiles(email)')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (submissionId: string) => {
    const { data } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('submission_id', submissionId);
    
    setDocuments(data || []);
  };

  const handleReview = async (submissionId: string, status: string, level?: string) => {
    try {
      const { error } = await supabase
        .from('kyc_submissions')
        .update({
          status,
          verification_level: level || 'basic',
          reviewed_at: new Date().toISOString(),
          admin_notes: reviewNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Submission ${status}`);
      loadSubmissions();
      setSelectedSubmission(null);
      setReviewNotes('');
    } catch (error: any) {
      toast.error('Failed to update submission');
    }
  };

  const selectSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    loadDocuments(submission.id);
  };

  if (selectedSubmission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
            ← Back to List
          </Button>
          <KYCVerificationBadge status={selectedSubmission.status} level={selectedSubmission.verification_level} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Name:</strong> {selectedSubmission.first_name} {selectedSubmission.last_name}</div>
              <div><strong>DOB:</strong> {selectedSubmission.date_of_birth}</div>
              <div><strong>Nationality:</strong> {selectedSubmission.nationality}</div>
              <div><strong>Phone:</strong> {selectedSubmission.phone_number}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>{selectedSubmission.address_line1}</div>
              <div>{selectedSubmission.address_line2}</div>
              <div>{selectedSubmission.city}, {selectedSubmission.state_province} {selectedSubmission.postal_code}</div>
              <div>{selectedSubmission.country}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ID Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Type:</strong> {selectedSubmission.id_document_type}</div>
              <div><strong>Number:</strong> {selectedSubmission.id_document_number}</div>
              <div><strong>Expiry:</strong> {selectedSubmission.id_document_expiry}</div>
              <div><strong>Country:</strong> {selectedSubmission.id_document_issuing_country}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{doc.document_type}</span>
                    <Badge>{doc.upload_status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Add review notes..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => handleReview(selectedSubmission.id, 'approved', 'full')}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {['pending', 'under_review', 'approved', 'rejected'].map(status => {
          const count = submissions.filter(s => s.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{status.replace('_', ' ')}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KYC Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {submissions.map(submission => (
              <div 
                key={submission.id}
                onClick={() => selectSubmission(submission)}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <div className="font-medium">{submission.first_name} {submission.last_name}</div>
                  <div className="text-sm text-gray-500">{submission.profiles?.email}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </div>
                  <KYCVerificationBadge status={submission.status} level={submission.verification_level} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
