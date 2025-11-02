import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { envSyncService, EnvVariable } from '@/services/envSyncService';

export function EnvVariableDetector() {
  const [variables, setVariables] = useState<EnvVariable[]>([]);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<'vercel' | 'netlify'>('vercel');

  const detectVariables = async () => {
    setLoading(true);
    try {
      const detected = await envSyncService.detectMissingVars(platform);
      setVariables(detected);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    detectVariables();
  }, [platform]);

  const missingCount = variables.filter(v => !v.present && v.required).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Environment Variables Detection</CardTitle>
          <Button onClick={detectVariables} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Scan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={platform === 'vercel' ? 'default' : 'outline'}
            onClick={() => setPlatform('vercel')}
            size="sm"
          >
            Vercel
          </Button>
          <Button
            variant={platform === 'netlify' ? 'default' : 'outline'}
            onClick={() => setPlatform('netlify')}
            size="sm"
          >
            Netlify
          </Button>
        </div>

        {missingCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">{missingCount} required variables missing</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {variables.map((envVar) => (
            <div key={envVar.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono">{envVar.key}</code>
                  {envVar.required && <Badge variant="destructive">Required</Badge>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{envVar.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {envVar.present ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
