import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { asoService } from '@/lib/asoService';
import { Progress } from '@/components/ui/progress';

export function ASORecommendationsTab() {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await asoService.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      critical: { variant: 'destructive', icon: AlertCircle },
      high: { variant: 'default', icon: TrendingUp },
      medium: { variant: 'secondary', icon: Clock },
      low: { variant: 'outline', icon: CheckCircle }
    };
    const config = variants[priority] || variants.medium;
    const Icon = config.icon;
    return <Badge variant={config.variant}><Icon className="h-3 w-3 mr-1" />{priority}</Badge>;
  };

  const getEffortBadge = (effort: string) => {
    const colors: any = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    };
    return <Badge className={colors[effort]}>{effort} effort</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      keywords: '🔍',
      screenshots: '📸',
      description: '📝',
      ratings: '⭐',
      localization: '🌍',
      technical: '⚙️'
    };
    return icons[category] || '💡';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        {getPriorityBadge(rec.priority)}
                        {getEffortBadge(rec.effort_level)}
                      </div>
                      <p className="text-muted-foreground mb-4">{rec.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Impact Score</span>
                            <span className="text-sm font-bold">{rec.impact_score}/100</span>
                          </div>
                          <Progress value={rec.impact_score} className="h-2" />
                        </div>
                        <Badge variant="outline" className="capitalize">{rec.category}</Badge>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      {rec.status === 'pending' && (
                        <>
                          <Button size="sm">Implement</Button>
                          <Button size="sm" variant="outline">Dismiss</Button>
                        </>
                      )}
                      {rec.status === 'in_progress' && (
                        <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
                      )}
                      {rec.status === 'completed' && (
                        <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
                      )}
                      {rec.status === 'dismissed' && (
                        <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Dismissed</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {recommendations.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Optimized!</h3>
                <p className="text-muted-foreground">No new recommendations at this time.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
