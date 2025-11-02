import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Upload, CheckCircle, FileText, Camera, Loader2 } from 'lucide-react';

interface KYCDocumentUploadProps {
  submissionId: string;
  onUploadComplete: () => void;
}

export function KYCDocumentUpload({ submissionId, onUploadComplete }: KYCDocumentUploadProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<Set<string>>(new Set());
  const fileInputRefs = {
    id_front: useRef<HTMLInputElement>(null),
    id_back: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
    proof_of_address: useRef<HTMLInputElement>(null)
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploading(documentType);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        
        const { error } = await supabase.functions.invoke('upload-kyc-document', {
          body: {
            submissionId,
            documentType,
            fileData: base64,
            fileName: file.name,
            mimeType: file.type
          }
        });

        if (error) throw error;

        setUploaded(prev => new Set(prev).add(documentType));
        toast.success(`${documentType.replace('_', ' ')} uploaded successfully`);
      };
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const documents = [
    { type: 'id_front', label: 'ID Front', icon: FileText, description: 'Front side of your ID document' },
    { type: 'id_back', label: 'ID Back', icon: FileText, description: 'Back side of your ID document' },
    { type: 'selfie', label: 'Selfie', icon: Camera, description: 'Clear photo of your face' },
    { type: 'proof_of_address', label: 'Proof of Address', icon: FileText, description: 'Utility bill or bank statement' }
  ];

  const allUploaded = documents.every(doc => uploaded.has(doc.type));

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {documents.map(doc => {
          const Icon = doc.icon;
          const isUploaded = uploaded.has(doc.type);
          const isUploading = uploading === doc.type;

          return (
            <Card key={doc.type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {doc.label}
                  {isUploaded && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                </CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRefs[doc.type as keyof typeof fileInputRefs]}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(doc.type, file);
                  }}
                />
                <Button
                  variant={isUploaded ? "outline" : "default"}
                  disabled={isUploading}
                  onClick={() => fileInputRefs[doc.type as keyof typeof fileInputRefs].current?.click()}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : isUploaded ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload {doc.label}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button 
        onClick={onUploadComplete} 
        disabled={!allUploaded}
        className="w-full"
      >
        Continue to Facial Verification
      </Button>
    </div>
  );
}
