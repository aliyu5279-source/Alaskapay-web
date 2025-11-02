import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Search, Users, Target, Award } from 'lucide-react';
import { asoService } from '@/lib/asoService';
import { ASOKeywordsTab } from './ASOKeywordsTab';
import { ASOCompetitorsTab } from './ASOCompetitorsTab';
import { ASOABTestingTab } from './ASOABTestingTab';
import { ASOConversionTab } from './ASOConversionTab';
import { ASORecommendationsTab } from './ASORecommendationsTab';

export function ASODashboard() {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [visibilityScore, setVisibilityScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const kw = await asoService.getKeywords();
      setKeywords(kw);
      const score = asoService.calculateVisibilityScore(kw);
      setVisibilityScore(score);
    } catch (error) {
      console.error('Error loading ASO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const rankedKeywords = keywords.filter(k => k.current_rank);
  const avgRank = rankedKeywords.length > 0 
    ? rankedKeywords.reduce((sum, k) => sum + k.current_rank, 0) / rankedKeywords.length 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">App Store Optimization</h2>
        <p className="text-muted-foreground">Monitor keyword rankings, competitor performance, and conversion metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visibility Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visibilityScore.toFixed(1)}/100</div>
            <p className="text-xs text-muted-foreground">Overall search visibility</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Keywords</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.length}</div>
            <p className="text-xs text-muted-foreground">{rankedKeywords.length} ranked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rank</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRank > 0 ? avgRank.toFixed(0) : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Across all keywords</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top 10 Keywords</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rankedKeywords.filter(k => k.current_rank <= 10).length}
            </div>
            <p className="text-xs text-muted-foreground">High visibility terms</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <ASOKeywordsTab onUpdate={loadData} />
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <ASOCompetitorsTab />
        </TabsContent>

        <TabsContent value="abtesting" className="space-y-4">
          <ASOABTestingTab />
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <ASOConversionTab />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <ASORecommendationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
