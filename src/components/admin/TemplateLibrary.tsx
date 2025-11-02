import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emailTemplateService } from '@/lib/emailTemplateService';

const TEMPLATE_LIBRARY = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Warm welcome for new users',
    category: 'transactional',
    subject: 'Welcome to {{company_name}}, {{user_name}}!',
    html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Welcome to {{company_name}}!</h1>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi {{user_name}},</p>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">We're excited to have you on board. Get started by exploring our features.</p>
      <a href="{{dashboard_url}}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Get Started</a>
    </div>`,
    variables: ['company_name', 'user_name', 'dashboard_url']
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    description: 'Secure password reset link',
    category: 'transactional',
    subject: 'Reset your password',
    html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Password Reset Request</h1>
      <p style="color: #666;">Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="{{reset_url}}" style="display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
    </div>`,
    variables: ['reset_url']
  },
  {
    id: 'receipt',
    name: 'Payment Receipt',
    description: 'Transaction confirmation',
    category: 'transactional',
    subject: 'Receipt for your payment - {{transaction_id}}',
    html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Payment Received</h1>
      <p>Thank you for your payment of {{amount}}.</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Transaction ID:</strong> {{transaction_id}}</p>
        <p><strong>Amount:</strong> {{amount}}</p>
        <p><strong>Date:</strong> {{date}}</p>
      </div>
    </div>`,
    variables: ['transaction_id', 'amount', 'date']
  }
];

interface TemplateLibraryProps {
  onUseTemplate: (template: any) => void;
}

export function TemplateLibrary({ onUseTemplate }: TemplateLibraryProps) {
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const { toast } = useToast();

  const handleUseTemplate = async (template: any) => {
    try {
      const newTemplate = await emailTemplateService.createTemplate({
        ...template,
        status: 'draft'
      });
      
      toast({
        title: 'Success',
        description: 'Template added to your collection'
      });
      
      onUseTemplate(newTemplate);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {TEMPLATE_LIBRARY.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleUseTemplate(template)}>
                <Copy className="mr-2 h-4 w-4" />
                Use Template
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(template)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
