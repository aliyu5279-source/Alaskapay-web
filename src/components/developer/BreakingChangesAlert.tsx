import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';

export function BreakingChangesAlert() {
  const [dismissed, setDismissed] = useState(false);

  const breakingChanges = [
    {
      version: 'v2.0.0',
      date: '2025-08-15',
      deprecationDate: '2025-11-15',
      changes: [
        'Authentication method changed from Basic to Bearer tokens',
        'All field names converted to snake_case',
        'Legacy /payment endpoint removed'
      ]
    }
  ];

  if (dismissed || breakingChanges.length === 0) return null;

  return (
    <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900 dark:text-red-100">
              Breaking Changes Alert
            </AlertTitle>
            <Badge variant="destructive">Action Required</Badge>
          </div>
          
          {breakingChanges.map((change) => (
            <div key={change.version} className="space-y-2">
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>{change.version}</strong> introduced breaking changes. 
                Legacy endpoints will be fully deprecated on <strong>{change.deprecationDate}</strong>.
              </AlertDescription>
              
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                {change.changes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="destructive">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Migration Guide
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDismissed(true)}>
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}