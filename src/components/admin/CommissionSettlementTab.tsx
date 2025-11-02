import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { COMMISSION_CONFIG } from '@/config/commissionConfig';
import { CommissionSettlementService } from '@/services/commissionSettlementService';
import { Building2, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CommissionSettlementTab() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, failed: 0 });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettlements();
    loadStats();
  }, []);

  const loadSettlements = async () => {
    const { data } = await supabase
      .from('commission_settlements')
      .select('*')
      .order('initiated_at', { ascending: false })
      .limit(50);
    setSettlements(data || []);
  };

  const loadStats = async () => {
    const { data } = await supabase.from('commission_settlements').select('status, amount');
    const total = data?.reduce((sum, s) => sum + parseFloat(s.amount), 0) || 0;
    const pending = data?.filter(s => s.status === 'pending').length || 0;
    const completed = data?.filter(s => s.status === 'completed').length || 0;
    const failed = data?.filter(s => s.status === 'failed').length || 0;
    setStats({ total, pending, completed, failed });
  };

  const processSettlement = async () => {
    setProcessing(true);
    try {
      const result = await CommissionSettlementService.processAutoSettlement();
      toast({
        title: 'Settlement Processed',
        description: `${result.settled || 0} commissions settled successfully`,
      });
      loadSettlements();
      loadStats();
    } catch (error) {
      toast({
        title: 'Settlement Failed',
        description: 'Failed to process settlements',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Commission Settlements</h2>
          <p className="text-muted-foreground">Automatic settlements to Taj Bank</p>
        </div>
        <Button onClick={processSettlement} disabled={processing}>
          {processing ? 'Processing...' : 'Process Settlements'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Settled</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.total.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Company:</span>
            <span className="font-medium">{COMMISSION_CONFIG.company.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bank:</span>
            <span className="font-medium">{COMMISSION_CONFIG.company.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account:</span>
            <span className="font-medium">{COMMISSION_CONFIG.company.accountNumber}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Settlements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">₦{parseFloat(settlement.amount).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(settlement.initiated_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  settlement.status === 'completed' ? 'default' :
                  settlement.status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {settlement.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
