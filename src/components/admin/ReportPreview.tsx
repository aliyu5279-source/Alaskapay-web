import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReportPreviewProps {
  sections: any[];
  branding: any;
  onClose: () => void;
}

export function ReportPreview({ sections, branding, onClose }: ReportPreviewProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          <div className="p-8 bg-white" style={{ color: '#000' }}>
            {branding.logo_url && (
              <img src={branding.logo_url} alt="Logo" className="h-12 mb-6" />
            )}

            <h1 className="text-3xl font-bold mb-2" style={{ color: branding.primary_color }}>
              Analytics Report
            </h1>
            <p className="text-gray-600 mb-8">Generated on {new Date().toLocaleDateString()}</p>

            {sections.map((section, idx) => (
              <Card key={section.id} className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: branding.secondary_color }}>
                  {section.title}
                </h2>
                <div className="text-gray-600">
                  {section.type === 'metric' && <div className="text-4xl font-bold">1,234</div>}
                  {section.type.includes('chart') && (
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                      {section.type.replace('-', ' ').toUpperCase()} Preview
                    </div>
                  )}
                  {section.type === 'table' && (
                    <div className="border rounded">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-2 text-left">Column 1</th>
                            <th className="p-2 text-left">Column 2</th>
                            <th className="p-2 text-left">Column 3</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="p-2">Sample</td><td className="p-2">Data</td><td className="p-2">Row</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 justify-end">
          <Button variant="outline"><Mail className="w-4 h-4 mr-2" />Email</Button>
          <Button><Download className="w-4 h-4 mr-2" />Download PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
