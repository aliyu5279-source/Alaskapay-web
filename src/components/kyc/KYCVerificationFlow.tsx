import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KYCSubmissionForm } from './KYCSubmissionForm';
import { KYCDocumentUpload } from './KYCDocumentUpload';
import { KYCLivenessCheck } from './KYCLivenessCheck';
import { CheckCircle } from 'lucide-react';

export function KYCVerificationFlow() {
  const [step, setStep] = useState(1);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Personal Information', description: 'Enter your details' },
    { number: 2, title: 'Document Upload', description: 'Upload ID documents' },
    { number: 3, title: 'Facial Verification', description: 'Verify your identity' },
    { number: 4, title: 'Complete', description: 'Verification submitted' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between mb-8">
        {steps.map((s, idx) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step > s.number ? 'bg-green-500 text-white' : 
                step === s.number ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {step > s.number ? <CheckCircle className="h-5 w-5" /> : s.number}
              </div>
              <div className="text-center mt-2">
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-xs text-gray-500">{s.description}</div>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-1 flex-1 ${step > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <KYCSubmissionForm 
          onSubmissionCreated={(id) => {
            setSubmissionId(id);
            setStep(2);
          }} 
        />
      )}

      {step === 2 && submissionId && (
        <KYCDocumentUpload 
          submissionId={submissionId}
          onUploadComplete={() => setStep(3)}
        />
      )}

      {step === 3 && submissionId && (
        <KYCLivenessCheck 
          submissionId={submissionId}
          onVerificationComplete={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Verification Submitted
            </CardTitle>
            <CardDescription>
              Your KYC verification has been submitted successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Our compliance team will review your submission within 1-2 business days. 
              You'll receive an email notification once your verification is complete.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
