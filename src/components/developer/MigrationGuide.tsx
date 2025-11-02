import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export function MigrationGuide() {
  const migrations = [
    {
      from: 'v1.x',
      to: 'v2.0',
      difficulty: 'high',
      estimatedTime: '2-4 hours',
      steps: [
        {
          title: 'Update Authentication',
          description: 'Switch from Basic Auth to Bearer tokens',
          before: `curl -u username:password https://api.example.com/transactions`,
          after: `curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/transactions`
        },
        {
          title: 'Update Field Names',
          description: 'All fields now use snake_case instead of camelCase',
          before: `{ "userId": "123", "firstName": "John" }`,
          after: `{ "user_id": "123", "first_name": "John" }`
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Always test migrations in a development environment before deploying to production.
        </AlertDescription>
      </Alert>

      {migrations.map((migration) => (
        <Card key={`${migration.from}-${migration.to}`} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{migration.from}</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge>{migration.to}</Badge>
            </div>
            <div className="flex gap-2">
              <Badge variant={migration.difficulty === 'high' ? 'destructive' : 'secondary'}>
                {migration.difficulty} difficulty
              </Badge>
              <Badge variant="outline">{migration.estimatedTime}</Badge>
            </div>
          </div>

          <div className="space-y-6">
            {migration.steps.map((step, index) => (
              <div key={index}>
                <div className="flex items-start gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                <Tabs defaultValue="before" className="w-full">
                  <TabsList>
                    <TabsTrigger value="before">Before (Old)</TabsTrigger>
                    <TabsTrigger value="after">After (New)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="before">
                    <CodeBlock code={step.before} language="bash" />
                  </TabsContent>
                  <TabsContent value="after">
                    <CodeBlock code={step.after} language="bash" />
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Migration Checklist</h4>
                <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-200">
                  <li>✓ Update authentication headers</li>
                  <li>✓ Convert all field names to snake_case</li>
                  <li>✓ Test all API endpoints</li>
                  <li>✓ Update error handling</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}