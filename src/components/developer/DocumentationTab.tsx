import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code, Webhook, Shield, Zap, AlertTriangle, Package } from 'lucide-react';
import { APITester } from './APITester';
import { AuthenticationGuide } from './AuthenticationGuide';
import { EndpointReference } from './EndpointReference';
import { RateLimitsSection } from './RateLimitsSection';
import { ErrorHandlingGuide } from './ErrorHandlingGuide';
import { WebhooksGuide } from './WebhooksGuide';
import { SDKSection } from './SDKSection';

export default function DocumentationTab() {

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">API Documentation</h2>
        <p className="text-gray-600">
          Complete reference for integrating Alaska Pay into your applications
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="sdks" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            SDKs
          </TabsTrigger>
          <TabsTrigger value="limits" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Limits
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Errors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <APITester />
        </TabsContent>

        <TabsContent value="auth" className="mt-6">
          <AuthenticationGuide />
        </TabsContent>

        <TabsContent value="endpoints" className="mt-6">
          <EndpointReference />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <WebhooksGuide />
        </TabsContent>

        <TabsContent value="sdks" className="mt-6">
          <SDKSection />
        </TabsContent>

        <TabsContent value="limits" className="mt-6">
          <RateLimitsSection />
        </TabsContent>

        <TabsContent value="errors" className="mt-6">
          <ErrorHandlingGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}
