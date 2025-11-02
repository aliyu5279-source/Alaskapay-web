import { useState } from 'react';
import { Settings, Zap, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnvVariableDetector } from './EnvVariableDetector';
import { EnvValidationPanel } from './EnvValidationPanel';
import { EnvSyncWizard } from './EnvSyncWizard';

export function EnvSyncDashboard() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [platform, setPlatform] = useState<'vercel' | 'netlify'>('vercel');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Environment Sync</h2>
          <p className="text-gray-600">Automated environment variable management</p>
        </div>
        <Button onClick={() => setWizardOpen(true)} size="lg" className="gap-2">
          <Zap className="h-5 w-5" />
          One-Click Setup
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => { setPlatform('vercel'); setWizardOpen(true); }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Sync to Vercel
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => { setPlatform('netlify'); setWizardOpen(true); }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Sync to Netlify
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Variables
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Vercel</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Netlify</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Local</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <a href="/VERCEL_AUTO_DEPLOY_SETUP.md" target="_blank">
                <Settings className="h-4 w-4 mr-2" />
                Vercel Setup Guide
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <a href="/NETLIFY_DEPLOY.md" target="_blank">
                <Settings className="h-4 w-4 mr-2" />
                Netlify Setup Guide
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="detector" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detector">Variable Detector</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="detector" className="space-y-4">
          <EnvVariableDetector />
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <EnvValidationPanel />
        </TabsContent>
      </Tabs>

      <EnvSyncWizard 
        open={wizardOpen} 
        onClose={() => setWizardOpen(false)} 
        platform={platform}
      />
    </div>
  );
}
