import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface DeliverabilityRecommendationsProps {
  metrics: any;
}

export default function DeliverabilityRecommendations({ metrics }: DeliverabilityRecommendationsProps) {
  if (!metrics) return null;

  const recommendations = [];
  const bounceRate = parseFloat(metrics.bounceRate);
  const spamRate = parseFloat(metrics.spamRate);
  const openRate = parseFloat(metrics.openRate);

  if (bounceRate > 2) {
    recommendations.push({
      severity: 'high',
      title: 'High Bounce Rate Detected',
      description: 'Your bounce rate is above 2%. Clean your email list and implement double opt-in.',
      icon: AlertTriangle
    });
  }

  if (spamRate > 0.1) {
    recommendations.push({
      severity: 'high',
      title: 'Elevated Spam Complaints',
      description: 'Review email content and ensure clear unsubscribe options are present.',
      icon: AlertTriangle
    });
  }

  if (openRate < 15) {
    recommendations.push({
      severity: 'medium',
      title: 'Low Open Rate',
      description: 'Improve subject lines and sender name. Test different send times.',
      icon: TrendingUp
    });
  }

  recommendations.push({
    severity: 'low',
    title: 'Maintain List Hygiene',
    description: 'Regularly remove inactive subscribers and validate email addresses.',
    icon: CheckCircle
  });

  recommendations.push({
    severity: 'low',
    title: 'Warm Up New IPs',
    description: 'Gradually increase sending volume when using new IP addresses.',
    icon: Lightbulb
  });

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'destructive';
    if (severity === 'medium') return 'default';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Deliverability Recommendations
        </CardTitle>
        <CardDescription>Best practices to improve your email deliverability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <Alert key={index}>
            <rec.icon className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              {rec.title}
              <Badge variant={getSeverityColor(rec.severity)}>{rec.severity}</Badge>
            </AlertTitle>
            <AlertDescription>{rec.description}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
