import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIFinancialInsights } from './AIFinancialInsights';
import { AITransactionCategorizer } from './AITransactionCategorizer';
import { AIFraudDetector } from './AIFraudDetector';
import { Brain, Shield, Tag, TrendingUp } from 'lucide-react';

export function AIAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Management Dashboard
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage AI-powered features and insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Generating financial recommendations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Categorization</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Enabled</div>
            <p className="text-xs text-muted-foreground">
              Categorizing transactions automatically
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detection</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Monitoring</div>
            <p className="text-xs text-muted-foreground">
              Real-time fraud analysis
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Financial Insights</TabsTrigger>
          <TabsTrigger value="categorizer">Auto-Categorization</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <AIFinancialInsights />
        </TabsContent>

        <TabsContent value="categorizer" className="space-y-4">
          <AITransactionCategorizer />
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <AIFraudDetector />
        </TabsContent>
      </Tabs>
    </div>
  );
}