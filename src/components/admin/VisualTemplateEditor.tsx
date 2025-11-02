import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Link, Image, Type, Code, Eye } from 'lucide-react';

interface VisualTemplateEditorProps {
  content: string;
  onChange: (content: string) => void;
  variables: string[];
}

export function VisualTemplateEditor({ content, onChange, variables }: VisualTemplateEditorProps) {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const insertVariable = (variable: string) => {
    const varTag = `{{${variable}}}`;
    onChange(content + varTag);
  };

  const insertElement = (element: string) => {
    const elements: Record<string, string> = {
      heading: '<h2 style="color: #333; font-size: 24px; margin: 20px 0;">Heading</h2>',
      paragraph: '<p style="color: #666; font-size: 16px; line-height: 1.6; margin: 10px 0;">Your text here</p>',
      button: '<a href="#" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0;">Click Here</a>',
      image: '<img src="https://via.placeholder.com/600x300" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0;" />',
      divider: '<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />'
    };
    
    onChange(content + '\n' + elements[element]);
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
        <TabsList>
          <TabsTrigger value="visual">Visual Editor</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Insert Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => insertElement('heading')}>
                  <Type className="mr-2 h-4 w-4" />
                  Heading
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertElement('paragraph')}>
                  <Type className="mr-2 h-4 w-4" />
                  Paragraph
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertElement('button')}>
                  <Link className="mr-2 h-4 w-4" />
                  Button
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertElement('image')}>
                  <Image className="mr-2 h-4 w-4" />
                  Image
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertElement('divider')}>
                  Divider
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Insert Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <Button
                    key={variable}
                    size="sm"
                    variant="secondary"
                    onClick={() => insertVariable(variable)}
                  >
                    {`{{${variable}}}`}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded p-4 bg-white min-h-[300px]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[500px] p-4 font-mono text-sm border rounded"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
