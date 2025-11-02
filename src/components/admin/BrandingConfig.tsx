import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface BrandingConfigProps {
  branding: any;
  onChange: (branding: any) => void;
}

export function BrandingConfig({ branding, onChange }: BrandingConfigProps) {
  const updateBranding = (key: string, value: string) => {
    onChange({ ...branding, [key]: value });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Report Branding</h3>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <Label>Logo URL</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={branding.logo_url || ''}
              onChange={(e) => updateBranding('logo_url', e.target.value)}
              placeholder="https://..."
            />
            <Button variant="outline" size="icon">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Primary Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={branding.primary_color || '#3b82f6'}
              onChange={(e) => updateBranding('primary_color', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              value={branding.primary_color || '#3b82f6'}
              onChange={(e) => updateBranding('primary_color', e.target.value)}
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div>
          <Label>Secondary Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={branding.secondary_color || '#8b5cf6'}
              onChange={(e) => updateBranding('secondary_color', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              value={branding.secondary_color || '#8b5cf6'}
              onChange={(e) => updateBranding('secondary_color', e.target.value)}
              placeholder="#8b5cf6"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
