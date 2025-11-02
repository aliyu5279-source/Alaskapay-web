import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface TemplatePreviewModalProps {
  template: any;
  open: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({ template, open, onClose }: TemplatePreviewModalProps) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const renderContent = (content: string) => {
    let rendered = content;
    template.variables?.forEach((variable: string) => {
      const value = variableValues[variable] || `{{${variable}}}`;
      rendered = rendered.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });
    return rendered;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {template.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="variables">Test Variables</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 pb-4 border-b">
                  <div className="text-sm text-muted-foreground mb-1">Subject:</div>
                  <div className="font-semibold">{renderContent(template.subject)}</div>
                </div>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderContent(template.html_content) }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variables" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter test values for variables to see how they appear in the email
                </p>
                {template.variables?.map((variable: string) => (
                  <div key={variable}>
                    <Label>{variable}</Label>
                    <Input
                      value={variableValues[variable] || ''}
                      onChange={(e) => setVariableValues({
                        ...variableValues,
                        [variable]: e.target.value
                      })}
                      placeholder={`Enter ${variable}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
