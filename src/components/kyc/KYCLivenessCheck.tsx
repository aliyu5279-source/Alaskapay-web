import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Camera, Loader2, CheckCircle } from 'lucide-react';

interface KYCLivenessCheckProps {
  submissionId: string;
  onVerificationComplete: () => void;
}

export function KYCLivenessCheck({ submissionId, onVerificationComplete }: KYCLivenessCheckProps) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      toast.error('Camera access denied');
    }
  };

  const captureAndVerify = async () => {
    if (!videoRef.current) return;

    setLoading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      const selfieData = canvas.toDataURL('image/jpeg').split(',')[1];

      const { data, error } = await supabase.functions.invoke('verify-kyc-liveness', {
        body: {
          submissionId,
          selfieData,
          idPhotoData: selfieData
        }
      });

      if (error) throw error;

      if (data.passed) {
        setVerified(true);
        toast.success('Liveness verification passed!');
        stream?.getTracks().forEach(track => track.stop());
        setTimeout(onVerificationComplete, 2000);
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Facial Liveness Verification
        </CardTitle>
        <CardDescription>
          Position your face in the frame and capture a clear photo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {verified && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!stream ? (
            <Button onClick={startCamera} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <Button 
              onClick={captureAndVerify} 
              disabled={loading || verified}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : verified ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verified
                </>
              ) : (
                'Capture & Verify'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
