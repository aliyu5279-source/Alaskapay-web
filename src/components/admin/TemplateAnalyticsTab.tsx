import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Mail, MousePointer, Eye, TrendingUp, DollarSign } from 'lucide-react';

export const TemplateAnalyticsTab: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data: templatesData } = await supabase
        .from('email_templates')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (templatesData) {
        setTemplates(templatesData);
        await loadAllAnalytics(templatesData);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllAnalytics = async (templatesData: any[]) => {
    const analyticsData: any = {};
    
    for (const template of templatesData) {
      const { data } = await supabase.functions.invoke('get-template-analytics', {
        body: { templateId: template.id }
      });
      
      if (data?.analytics) {
        analyticsData[template.id] = data.analytics;
      }
    }
    
    setAnalytics(analyticsData);
  };

  const getComparisonData = () => {
    return templates.map(template => ({
      name: template.name,
      openRate: parseFloat(analytics[template.id]?.openRate || 0),
      clickRate: parseFloat(analytics[template.id]?.clickRate || 0),
      conversionRate: parseFloat(analytics[template.id]?.conversionRate || 0)
    }));
  };

  const selectedAnalytics = selectedTemplate ? analytics[selectedTemplate] : null;

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Template Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(analytics).reduce((sum: number, a: any) => sum + (a.totalSent || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(Object.values(analytics).reduce((sum: number, a: any) => sum + parseFloat(a.openRate || 0), 0) / templates.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(Object.values(analytics).reduce((sum: number, a: any) => sum + parseFloat(a.clickRate || 0), 0) / templates.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Object.values(analytics).reduce((sum: number, a: any) => sum + (a.totalRevenue || 0), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getComparisonData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="openRate" fill="#3b82f6" name="Open Rate %" />
              <Bar dataKey="clickRate" fill="#10b981" name="Click Rate %" />
              <Bar dataKey="conversionRate" fill="#f59e0b" name="Conversion Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Template</th>
                  <th className="text-right py-2">Sent</th>
                  <th className="text-right py-2">Open Rate</th>
                  <th className="text-right py-2">Click Rate</th>
                  <th className="text-right py-2">Conversion</th>
                  <th className="text-right py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {templates.map(template => {
                  const stats = analytics[template.id] || {};
                  return (
                    <tr key={template.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{template.name}</td>
                      <td className="text-right">{stats.totalSent || 0}</td>
                      <td className="text-right">{stats.openRate || 0}%</td>
                      <td className="text-right">{stats.clickRate || 0}%</td>
                      <td className="text-right">{stats.conversionRate || 0}%</td>
                      <td className="text-right">${stats.totalRevenue || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
