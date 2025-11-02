import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { BookOpen, Key, Code, Activity, Webhook, Clock, PlayCircle } from 'lucide-react';
import DocumentationTab from './DocumentationTab';
import { APIKeysTab } from './APIKeysTab';
import { WebhooksTab } from './WebhooksTab';
import { UsageAnalyticsTab } from './UsageAnalyticsTab';
import { AppsTab } from './AppsTab';

import { ChangelogTab } from './ChangelogTab';

import APIPlayground from './APIPlayground';

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState('playground');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Developer Portal</h1>
        <p className="text-muted-foreground">
          Build powerful integrations with our comprehensive API
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="playground">
            <PlayCircle className="h-4 w-4 mr-2" />
            Playground
          </TabsTrigger>
          <TabsTrigger value="docs">
            <BookOpen className="h-4 w-4 mr-2" />
            Docs
          </TabsTrigger>
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="apps">
            <Code className="h-4 w-4 mr-2" />
            Apps
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="changelog">
            <Clock className="h-4 w-4 mr-2" />
            Changelog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playground">
          <APIPlayground />
        </TabsContent>

        <TabsContent value="docs">
          <DocumentationTab />
        </TabsContent>

        <TabsContent value="keys">
          <APIKeysTab />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhooksTab />
        </TabsContent>

        <TabsContent value="apps">
          <AppsTab />
        </TabsContent>

        <TabsContent value="analytics">
          <UsageAnalyticsTab />
        </TabsContent>

        <TabsContent value="changelog">
          <ChangelogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
