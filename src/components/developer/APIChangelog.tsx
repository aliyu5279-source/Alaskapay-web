import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { VersionTimeline } from './VersionTimeline';
import { MigrationGuide } from './MigrationGuide';
import { BreakingChangesAlert } from './BreakingChangesAlert';

export function APIChangelog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const versions = [
    {
      version: 'v2.1.0',
      date: '2025-10-01',
      status: 'current',
      changes: {
        added: ['New webhook event: transaction.refunded', 'Support for multi-currency wallets', 'Batch transaction API'],
        improved: ['Faster response times for /transactions endpoint', 'Enhanced error messages'],
        deprecated: ['Legacy /payment endpoint (use /transactions instead)'],
        breaking: []
      }
    },
    {
      version: 'v2.0.0',
      date: '2025-08-15',
      status: 'stable',
      changes: {
        added: ['GraphQL API support', 'Real-time transaction updates via WebSockets'],
        improved: ['Complete API redesign for better consistency'],
        deprecated: ['All v1.x endpoints'],
        breaking: ['Changed authentication from Basic to Bearer tokens', 'Renamed all user fields to snake_case']
      }
    }
  ];

  return (
    <div className="space-y-6">
      <BreakingChangesAlert />
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search changelog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="versions">All Versions</TabsTrigger>
          <TabsTrigger value="migration">Migration Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <VersionTimeline versions={versions} />
        </TabsContent>

        <TabsContent value="versions">
          <div className="space-y-6">
            {versions.map((v) => (
              <Card key={v.version} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{v.version}</h3>
                    <p className="text-sm text-muted-foreground">{v.date}</p>
                  </div>
                  <Badge>{v.status}</Badge>
                </div>

                {v.changes.breaking.length > 0 && (
                  <Alert className="mb-4 border-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This version contains breaking changes
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {v.changes.added.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Added</h4>
                      <ul className="space-y-1">
                        {v.changes.added.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {v.changes.deprecated.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2">Deprecated</h4>
                      <ul className="space-y-1">
                        {v.changes.deprecated.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="migration">
          <MigrationGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}