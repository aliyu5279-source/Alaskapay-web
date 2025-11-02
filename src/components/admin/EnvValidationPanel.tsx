import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { envSyncService, EnvVariable } from '@/services/envSyncService';

export function EnvValidationPanel() {
  const [variables, setVariables] = useState<EnvVariable[]>([]);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: true, errors: [] });
  const [validating, setValidating] = useState(false);

  const runValidation = async () => {
    setValidating(true);
    try {
      const detected = await envSyncService.detectMissingVars('vercel');
      setVariables(detected);
      const result = envSyncService.validateEnvVars(detected);
      setValidation(result);
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, []);

  const presentCount = variables.filter(v => v.present).length;
  const totalCount = variables.length;
  const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Environment Validation
          </CardTitle>
          <Button onClick={runValidation} disabled={validating} size="sm" variant="outline">
            {validating ? 'Validating...' : 'Re-validate'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Configuration Status</span>
            <span className="text-sm text-gray-600">{presentCount} / {totalCount}</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className={`p-4 rounded-lg border ${
          validation.valid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {validation.valid ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">All validations passed</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">Validation issues found</span>
              </>
            )}
          </div>
        </div>

        {validation.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Issues to Fix
            </h4>
            {validation.errors.map((error, idx) => (
              <div key={idx} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                • {error}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Variable Status</h4>
          {variables.map((envVar) => (
            <div key={envVar.key} className="flex items-center justify-between text-sm p-2 border rounded">
              <code className="font-mono">{envVar.key}</code>
              {envVar.present ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
