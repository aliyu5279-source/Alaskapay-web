import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Trophy } from 'lucide-react';

export const ABTestingTab: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);

  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    template_a_id: '',
    template_b_id: '',
    traffic_split: 50,
    goal_metric: 'open_rate'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, testsRes] = await Promise.all([
        supabase.from('email_templates').select('*').eq('status', 'active'),
        supabase.functions.invoke('manage-ab-tests', { body: { action: 'list' } })
      ]);

      if (templatesRes.data) setTemplates(templatesRes.data);
      if (testsRes.data?.data) setTests(testsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTest = async () => {
    try {
      const { data } = await supabase.functions.invoke('manage-ab-tests', {
        body: { action: 'create', testData: newTest }
      });

      if (data?.success) {
        setShowCreateDialog(false);
        loadData();
        setNewTest({
          name: '',
          description: '',
          template_a_id: '',
          template_b_id: '',
          traffic_split: 50,
          goal_metric: 'open_rate'
        });
      }
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const updateTestStatus = async (testId: string, status: string) => {
    try {
      await supabase.functions.invoke('manage-ab-tests', {
        body: { action: 'update', testId, testData: { status } }
      });
      loadData();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const viewResults = async (test: any) => {
    try {
      const { data } = await supabase.functions.invoke('manage-ab-tests', {
        body: { action: 'results', testId: test.id }
      });

      if (data?.success) {
        setSelectedTest(test);
        setTestResults(data.results);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-500',
      active: 'bg-green-500',
      paused: 'bg-yellow-500',
      completed: 'bg-blue-500'
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading A/B tests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">A/B Testing</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>Create A/B Test</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New A/B Test</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Test Name</Label>
                <Input
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  placeholder="Welcome Email Test"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newTest.description}
                  onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                  placeholder="Testing subject line variations"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Template A</Label>
                  <Select value={newTest.template_a_id} onValueChange={(v) => setNewTest({ ...newTest, template_a_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Template B</Label>
                  <Select value={newTest.template_b_id} onValueChange={(v) => setNewTest({ ...newTest, template_b_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Goal Metric</Label>
                <Select value={newTest.goal_metric} onValueChange={(v) => setNewTest({ ...newTest, goal_metric: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open_rate">Open Rate</SelectItem>
                    <SelectItem value="click_rate">Click Rate</SelectItem>
                    <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createTest} className="w-full">Create Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tests.map(test => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{test.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(test.status)}
                  {test.status === 'draft' && (
                    <Button size="sm" onClick={() => updateTestStatus(test.id, 'active')}>
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {test.status === 'active' && (
                    <Button size="sm" variant="outline" onClick={() => updateTestStatus(test.id, 'paused')}>
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => viewResults(test)}>
                    View Results
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedTest && testResults && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedTest.name} - Results</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Variant A</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sent:</span>
                      <span className="font-bold">{testResults.variantA.sent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opened:</span>
                      <span className="font-bold">{testResults.variantA.opened}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clicked:</span>
                      <span className="font-bold">{testResults.variantA.clicked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Converted:</span>
                      <span className="font-bold">{testResults.variantA.converted}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Variant B</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sent:</span>
                      <span className="font-bold">{testResults.variantB.sent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opened:</span>
                      <span className="font-bold">{testResults.variantB.opened}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clicked:</span>
                      <span className="font-bold">{testResults.variantB.clicked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Converted:</span>
                      <span className="font-bold">{testResults.variantB.converted}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
