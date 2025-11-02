import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, TrendingUp, Zap } from 'lucide-react';

interface LoadTestReportProps {
  report: {
    summary: {
      totalRequests: number;
      successRate: number;
      avgResponseTime: number;
      maxResponseTime: number;
      throughput: number;
      errorRate: number;
    };
    bottlenecks: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      affectedEndpoints: string[];
    }>;
    recommendations: Array<{
      category: string;
      priority: 'low' | 'medium' | 'high';
      recommendation: string;
      expectedImpact: string;
    }>;
    performanceScore: number;
  };
}

export function LoadTestReportViewer({ report }: LoadTestReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    const variants: any = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
      critical: 'destructive',
    };
    return variants[severity] || 'default';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`text-6xl font-bold ${getScoreColor(report.performanceScore)}`}>
              {report.performanceScore.toFixed(1)}
            </div>
            <div className="flex-1">
              <Progress value={report.performanceScore} className="h-4" />
              <p className="text-sm text-muted-foreground mt-2">
                {report.performanceScore >= 90 ? 'Excellent' : 
                 report.performanceScore >= 70 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={CheckCircle}
          label="Success Rate"
          value={`${report.summary.successRate.toFixed(2)}%`}
          color="text-green-600"
        />
        <MetricCard
          icon={Zap}
          label="Avg Response Time"
          value={`${report.summary.avgResponseTime.toFixed(0)}ms`}
          color="text-blue-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="Throughput"
          value={`${report.summary.throughput.toFixed(0)}/s`}
          color="text-purple-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Bottlenecks Identified
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.bottlenecks.map((bottleneck, idx) => (
              <div key={idx} className="border-l-4 border-yellow-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{bottleneck.type.replace(/_/g, ' ').toUpperCase()}</h4>
                  <Badge variant={getSeverityBadge(bottleneck.severity)}>
                    {bottleneck.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{bottleneck.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Affected: {bottleneck.affectedEndpoints.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge>{rec.category}</Badge>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="font-medium mb-1">{rec.recommendation}</p>
                <p className="text-sm text-green-600">Expected Impact: {rec.expectedImpact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <Icon className={`h-8 w-8 ${color}`} />
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
