import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBetaFeedback } from '@/hooks/useBetaFeedback';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackForm() {
  const { submitFeedback, uploadScreenshot, submitting } = useBetaFeedback();
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState<'bug' | 'feature' | 'improvement' | 'other'>('other');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let screenshotUrl = undefined;
    if (screenshot) {
      screenshotUrl = await uploadScreenshot(screenshot) || undefined;
    }

    const success = await submitFeedback({ feedback, category, priority, screenshot_url: screenshotUrl });
    if (success) {
      setFeedback('');
      setScreenshot(null);
      setScreenshotPreview('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>Help us improve by sharing your thoughts</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Feedback</Label>
            <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} required />
          </div>
          <div className="space-y-2">
            <Label>Screenshot (optional)</Label>
            {screenshotPreview ? (
              <div className="relative">
                <img src={screenshotPreview} className="w-full rounded border" />
                <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2" onClick={() => { setScreenshot(null); setScreenshotPreview(''); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center border-2 border-dashed rounded p-4 cursor-pointer hover:bg-muted">
                <Upload className="h-5 w-5 mr-2" />
                <span>Upload Screenshot</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
              </label>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
