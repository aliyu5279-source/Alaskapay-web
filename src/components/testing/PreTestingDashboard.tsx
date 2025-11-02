import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Clock, Play, Download } from 'lucide-react';

interface TestPhase {
  id: string;
  name: string;
  tests: number;
  passed: number;
  failed: number;
  running: boolean;
  duration: string;
}

export default function PreTestingDashboard() {
  const [phases, setPhases] = useState<TestPhase[]>([
    { id: 'unit', name: 'Unit Tests', tests: 156, passed: 0, failed: 0, running: false, duration: '2h' },
    { id: 'integration', name: 'Integration Tests', tests: 48, passed: 0, failed: 0, running: false, duration: '3h' },
    { id: 'native', name: 'Native Features', tests: 72, passed: 0, failed: 0, running: false, duration: '4h' },
    { id: 'device', name: 'Device Matrix', tests: 120, passed: 0, failed: 0, running: false, duration: '6h' },
    { id: 'performance', name: 'Performance', tests: 24, passed: 0, failed: 0, running: false, duration: '2h' },
    { id: 'security', name: 'Security', tests: 36, passed: 0, failed: 0, running: false, duration: '3h' },
  ]);

  const runPhase = (id: string) => {
    setPhases(prev => prev.map(p => p.id === id ? { ...p, running: true } : p));
    setTimeout(() => {
      setPhases(prev => prev.map(p => p.id === id ? { ...p, running: false, passed: p.tests - 2, failed: 2 } : p));
    }, 3000);
  };

  const totalTests = phases.reduce((sum, p) => sum + p.tests, 0);
  const totalPassed = phases.reduce((sum, p) => sum + p.passed, 0);
  const totalFailed = phases.reduce((sum, p) => sum + p.failed, 0);
  const progress = (totalPassed / totalTests) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pre-Launch Testing Dashboard</h1>
          <p className="text-muted-foreground">Complete all phases before production launch</p>
        </div>
        <Button onClick={() => phases.forEach(p => runPhase(p.id))}>
          <Play className="w-4 h-4 mr-2" />
          Run All Tests
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalPassed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{totalFailed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">{progress.toFixed(1)}% Complete</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {phases.map(phase => (
          <Card key={phase.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{phase.name}</h3>
                    <Badge variant={phase.running ? 'default' : phase.failed > 0 ? 'destructive' : 'secondary'}>
                      {phase.running ? 'Running' : phase.passed > 0 ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {phase.passed} passed
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      {phase.failed} failed
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {phase.duration}
                    </span>
                  </div>
                </div>
                <Button onClick={() => runPhase(phase.id)} disabled={phase.running}>
                  {phase.running ? 'Running...' : 'Run Tests'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}