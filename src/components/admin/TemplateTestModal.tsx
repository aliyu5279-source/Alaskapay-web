import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { X, Send } from 'lucide-react';

interface TemplateTestModalProps {
  template: any;
  onClose: () => void;
}

export function TemplateTestModal({ template, onClose }: TemplateTestModalProps) {
  const [testEmail, setTestEmail] = useState('');
  const [testData, setTestData] = useState<Record<string, string>>(
    template.variables.reduce((acc: any, v: string) => {
      acc[v] = `Test ${v}`;
      return acc;
    }, {})
  );
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendTest = async () => {
    if (!testEmail) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a test email address',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-email-template', {
        body: {
          templateId: template.id,
          testEmail,
          testData
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: data.message
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Test Template: {template.name}</h2>
        <Button variant="outline" onClick={onClose}>
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Test Email Address</Label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          {template.variables.length > 0 && (
            <>
              <div className="pt-4 border-t">
                <Label className="text-base">Test Data</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Provide sample values for template variables
                </p>
              </div>
              {template.variables.map((variable: string) => (
                <div key={variable}>
                  <Label>{variable}</Label>
                  <Input
                    value={testData[variable] || ''}
                    onChange={(e) => setTestData({ ...testData, [variable]: e.target.value })}
                    placeholder={`Sample ${variable}`}
                  />
                </div>
              ))}
            </>
          )}

          <Button onClick={handleSendTest} disabled={sending} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {sending ? 'Sending...' : 'Send Test Email'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
