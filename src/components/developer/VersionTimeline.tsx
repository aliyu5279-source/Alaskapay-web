import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface Version {
  version: string;
  date: string;
  status: string;
  changes: {
    added: string[];
    improved: string[];
    deprecated: string[];
    breaking: string[];
  };
}

interface VersionTimelineProps {
  versions: Version[];
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-8">
        {versions.map((version, index) => (
          <div key={version.version} className="relative pl-16">
            <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background" />
            
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{version.version}</h3>
                  <p className="text-sm text-muted-foreground">{version.date}</p>
                </div>
                <Badge variant={version.status === 'current' ? 'default' : 'secondary'}>
                  {version.status}
                </Badge>
              </div>

              <div className="space-y-3">
                {version.changes.breaking.length > 0 && (
                  <div className="flex items-start gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <div>
                      <strong>Breaking Changes:</strong>
                      <ul className="mt-1 space-y-1">
                        {version.changes.breaking.map((change, i) => (
                          <li key={i} className="text-sm">• {change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {version.changes.added.length > 0 && (
                  <div className="flex items-start gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <strong>New Features:</strong>
                      <ul className="mt-1 space-y-1">
                        {version.changes.added.map((change, i) => (
                          <li key={i} className="text-sm">• {change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {version.changes.improved.length > 0 && (
                  <div className="flex items-start gap-2 text-blue-600">
                    <Info className="h-4 w-4 mt-0.5" />
                    <div>
                      <strong>Improvements:</strong>
                      <ul className="mt-1 space-y-1">
                        {version.changes.improved.map((change, i) => (
                          <li key={i} className="text-sm">• {change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}