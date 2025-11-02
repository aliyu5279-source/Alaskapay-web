import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FraudRulesManager } from './FraudRulesManager';
import { FlaggedTransactionsPanel } from './FlaggedTransactionsPanel';
import { FraudAnalyticsDashboard } from './FraudAnalyticsDashboard';
import { Shield, AlertTriangle, Settings, BarChart3, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function FraudDetectionTab() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-red-600" />
            Fraud Detection System
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor suspicious activity and manage fraud prevention rules
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="flags" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Flagged Transactions
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Rules & Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <FraudAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="flags" className="space-y-6">
          <FlaggedTransactionsPanel />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <FraudRulesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
