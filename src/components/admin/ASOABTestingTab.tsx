import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Play, Pause, CheckCircle } from 'lucide-react';
import { asoService } from '@/lib/asoService';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export function ASOABTestingTab() {
  const [tests, setTests] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTest, setNewTest] = useState({
    test_name: '',
    test_type: 'screenshot',
    platform: 'both',
    variant_a: {},
    variant_b: {}
  });

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const data = await asoService.getABTests();
      setTests(data);
    } catch (error) {
      console.error('Error loading A/B tests:', error);
    }
  };

  const getConversionRate = (conversions: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((conversions / impressions) * 100).toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      draft: 'secondary',
      running: 'default',
      paused: 'outline',
      completed: 'default'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getWinnerBadge = (winner?: string) => {
    if (!winner) return null;
    if (winner === 'inconclusive') return <Badge variant="secondary">Inconclusive</Badge>;
    return <Badge variant="default" className="bg-green-500">Variant {winner.toUpperCase()} Wins</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>A/B Testing</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Create Test</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create A/B Test</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Test Name</Label>
                    <Input value={newTest.test_name} onChange={(e) => setNewTest({...newTest, test_name: e.target.value})} placeholder="Screenshot Test - Hero Image" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Test Type</Label>
                      <Select value={newTest.test_type} onValueChange={(v) => setNewTest({...newTest, test_type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="screenshot">Screenshot</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="icon">App Icon</SelectItem>
                          <SelectItem value="title">App Title</SelectItem>
                          <SelectItem value="subtitle">Subtitle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Platform</Label>
                      <Select value={newTest.platform} onValueChange={(v) => setNewTest({...newTest, platform: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ios">iOS</SelectItem>
                          <SelectItem value="android">Android</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Variant A</Label>
                      <Textarea placeholder="Describe variant A..." rows={3} />
                    </div>
                    <div>
                      <Label>Variant B</Label>
                      <Textarea placeholder="Describe variant B..." rows={3} />
                    </div>
                  </div>
                  <Button className="w-full">Create Test</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Variant A CR</TableHead>
                <TableHead>Variant B CR</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.test_name}</TableCell>
                  <TableCell><Badge variant="outline">{test.test_type}</Badge></TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>{getConversionRate(test.conversions_a, test.impressions_a)}%</TableCell>
                  <TableCell>{getConversionRate(test.conversions_b, test.impressions_b)}%</TableCell>
                  <TableCell>
                    {test.confidence_level && (
                      <div className="space-y-1">
                        <Progress value={test.confidence_level} className="h-2" />
                        <span className="text-xs text-muted-foreground">{test.confidence_level}%</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getWinnerBadge(test.winner)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {test.status === 'running' && <Button size="sm" variant="outline"><Pause className="h-3 w-3" /></Button>}
                      {test.status === 'paused' && <Button size="sm" variant="outline"><Play className="h-3 w-3" /></Button>}
                      {test.status === 'completed' && <Button size="sm" variant="outline"><CheckCircle className="h-3 w-3" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {tests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">No A/B tests created yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
