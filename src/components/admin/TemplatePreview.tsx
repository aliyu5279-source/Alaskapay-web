import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface TemplatePreviewProps {
  template: any;
  onClose: () => void;
}

export function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  const [sampleData, setSampleData] = useState<Record<string, string>>(
    template.variables.reduce((acc: any, v: string) => {
      acc[v] = `Sample ${v}`;
      return acc;
    }, {})
  );

  const renderContent = () => {
    let html = template.html_content;
    Object.keys(sampleData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, sampleData[key]);
    });
    return html;
  };

  const renderSubject = () => {
    let subject = template.subject;
    Object.keys(sampleData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, sampleData[key]);
    });
    return subject;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Preview: {template.name}</h2>
        <Button variant="outline" onClick={onClose}>
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sample Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.variables.map((variable: string) => (
              <div key={variable}>
                <Label>{variable}</Label>
                <Input
                  value={sampleData[variable] || ''}
                  onChange={(e) => setSampleData({ ...sampleData, [variable]: e.target.value })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subject</Label>
              <div className="p-3 bg-muted rounded-md font-medium">
                {renderSubject()}
              </div>
            </div>
            <div>
              <Label>Email Content</Label>
              <div 
                className="p-4 bg-white border rounded-md overflow-auto max-h-96"
                dangerouslySetInnerHTML={{ __html: renderContent() }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
