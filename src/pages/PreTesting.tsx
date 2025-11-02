import PreTestingDashboard from '@/components/testing/PreTestingDashboard';
import TestingChecklist from '@/components/testing/TestingChecklist';
import TestExecutor from '@/components/testing/TestExecutor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PreTesting() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>Pre-Launch Testing Mode</strong> - Complete all tests before production deployment
          </AlertDescription>
        </Alert>

        <PreTestingDashboard />

        <div className="grid gap-6 lg:grid-cols-2">
          <TestingChecklist />
          <TestExecutor />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Launch Readiness Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Zero P0 (critical) bugs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Less than 5 P1 (high priority) bugs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>All payment flows tested and verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Security audit completed and passed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Load testing passed (1000+ concurrent users)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>UAT feedback reviewed and addressed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}