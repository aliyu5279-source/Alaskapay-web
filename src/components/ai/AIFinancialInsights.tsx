import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, DollarSign } from 'lucide-react';
import { aiService, AIInsight } from '@/services/aiService';
import { supabase } from '@/lib/supabase';

export function AIFinancialInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactions) {
        const aiInsights = await aiService.generateFinancialInsights(transactions);
        setInsights(aiInsights);
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'spending': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'opportunity': return Lightbulb;
      case 'saving': return DollarSign;
      default: return Sparkles;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'spending': return 'text-blue-500';
      case 'warning': return 'text-red-500';
      case 'opportunity': return 'text-green-500';
      case 'saving': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Financial Insights
          </CardTitle>
          <Button onClick={loadInsights} disabled={loading} size="sm">
            {loading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 && !loading && (
          <p className="text-muted-foreground text-center py-8">
            No insights available. Complete more transactions to get AI-powered recommendations.
          </p>
        )}
        
        {insights.map((insight, i) => {
          const Icon = getIcon(insight.type);
          return (
            <div key={i} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${getColor(insight.type)}`} />
                  <h4 className="font-semibold">{insight.title}</h4>
                </div>
                <Badge variant="outline">
                  {Math.round(insight.confidence * 100)}% confident
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}