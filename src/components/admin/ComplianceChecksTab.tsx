import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function ComplianceChecksTab() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [checks, setChecks] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      let query = supabase.from('compliance_requirements').select('*').eq('is_active', true);
      if (filter !== 'all') query = query.eq('regulation_type', filter);
      
      const { data } = await query.order('severity', { ascending: false });
      setRequirements(data || []);

      const { data: checksData } = await supabase
        .from('compliance_checks')
        .select('*, compliance_requirements(*)')
        .order('check_date', { ascending: false })
        .limit(50);
      setChecks(checksData || []);
    } catch (error: any) {
      toast({ title: 'Error loading data', description: error.message, variant: 'destructive' });
    }
  };

  const runCheck = async (requirementId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('run-compliance-checks', {
        body: { requirement_id: requirementId }
      });

      if (error) throw error;
      toast({ title: 'Compliance check completed', description: 'Results have been recorded' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const runAllChecks = async () => {
    setLoading(true);
    try {
      for (const req of requirements) {
        await supabase.functions.invoke('run-compliance-checks', {
          body: { requirement_id: req.id }
        });
      }
      toast({ title: 'All checks completed' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regulations</SelectItem>
            <SelectItem value="CBN">CBN</SelectItem>
            <SelectItem value="NDPR">NDPR</SelectItem>
            <SelectItem value="GDPR">GDPR</SelectItem>
            <SelectItem value="PCI_DSS">PCI-DSS</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={runAllChecks} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Run All Checks
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Regulation</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Last Check</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map(req => {
                const lastCheck = checks.find(c => c.requirement_id === req.id);
                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-sm">{req.requirement_code}</TableCell>
                    <TableCell>{req.title}</TableCell>
                    <TableCell><Badge variant="outline">{req.regulation_type}</Badge></TableCell>
                    <TableCell><Badge className={req.severity === 'critical' ? 'bg-red-100 text-red-800' : ''}>{req.severity}</Badge></TableCell>
                    <TableCell>{req.check_frequency}</TableCell>
                    <TableCell>
                      {lastCheck ? (
                        <div>
                          <Badge className={getStatusColor(lastCheck.status)}>{lastCheck.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(lastCheck.check_date).toLocaleDateString()}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => runCheck(req.id)} disabled={loading}>
                        <Play className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}