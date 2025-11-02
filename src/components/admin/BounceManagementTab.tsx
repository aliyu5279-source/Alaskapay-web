import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, XCircle, Mail, TrendingUp, Upload, Download, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';


interface BounceTracking {
  id: string;
  email: string;
  total_sent: number;
  total_bounced: number;
  total_dropped: number;
  bounce_rate: number;
  last_bounce_at: string;
  last_bounce_reason: string;
  status: 'active' | 'flagged' | 'suspended' | 'verified';
  notes: string;
  created_at: string;
}

interface BounceAlert {
  id: string;
  alert_type: string;
  bounce_rate: number;
  total_bounces: number;
  total_sends: number;
  flagged_count: number;
  sent_at: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  notes: string | null;
}


export default function BounceManagementTab() {
  const [statistics, setStatistics] = useState<any>(null);
  const [tracking, setTracking] = useState<BounceTracking[]>([]);
  const [alerts, setAlerts] = useState<BounceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [alertNotes, setAlertNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAlerts, setShowAlerts] = useState(false);


  useEffect(() => {
    loadBounceData();
  }, [filterStatus]);

  const loadBounceData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-bounce-statistics', {
        body: { status: filterStatus === 'all' ? null : filterStatus }
      });

      if (error) throw error;

      setStatistics(data.statistics);
      setTracking(data.tracking);
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Error loading bounce data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEmailStatus = async (email: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke('update-email-status', {
        body: { email, status, notes }
      });

      if (error) throw error;

      setSelectedEmail(null);
      setNotes('');
      loadBounceData();
    } catch (error) {
      console.error('Error updating email status:', error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.functions.invoke('acknowledge-bounce-alert', {
        body: { alertId, userId: user.id, notes: alertNotes }
      });

      if (error) throw error;

      setSelectedAlert(null);
      setAlertNotes('');
      loadBounceData();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };


  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: 'default', icon: CheckCircle },
      flagged: { variant: 'destructive', icon: AlertCircle },
      suspended: { variant: 'secondary', icon: XCircle },
      verified: { variant: 'default', icon: CheckCircle }
    };
    const config = variants[status] || variants.active;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.overall_bounce_rate?.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics?.overall_bounce_rate > 5 ? 'Above threshold' : 'Within threshold'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_sent || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounced</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_bounced || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Emails</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.status_counts?.flagged || 0}</div>
          </CardContent>
        </Card>
      </div>

      {statistics?.overall_bounce_rate > 5 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Warning: Overall bounce rate exceeds 5% threshold. Review flagged emails below.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Bounce Tracking</CardTitle>
              <CardDescription>Monitor and manage problematic email addresses</CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bounce Rate</TableHead>
                <TableHead>Sent/Bounced</TableHead>
                <TableHead>Last Bounce</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracking.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.email}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <span className={record.bounce_rate > 20 ? 'text-red-600 font-bold' : ''}>
                      {record.bounce_rate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.total_sent} / {record.total_bounced + record.total_dropped}
                  </TableCell>
                  <TableCell>
                    {record.last_bounce_at 
                      ? new Date(record.last_bounce_at).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEmail(record.email)}
                      >
                        Manage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedEmail && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Manage: {selectedEmail}</h3>
              <Textarea
                placeholder="Add notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={() => updateEmailStatus(selectedEmail, 'verified')}>
                  Verify Email
                </Button>
                <Button variant="destructive" onClick={() => updateEmailStatus(selectedEmail, 'suspended')}>
                  Suspend
                </Button>
                <Button variant="outline" onClick={() => setSelectedEmail(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>View and acknowledge bounce rate alerts</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowAlerts(!showAlerts)}>
              {showAlerts ? 'Hide' : 'Show'} Alerts ({alerts.filter(a => !a.acknowledged_at).length} pending)
            </Button>
          </div>
        </CardHeader>
        {showAlerts && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                  <TableHead>Bounces/Sends</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{new Date(alert.sent_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="font-bold text-red-600">{alert.bounce_rate.toFixed(2)}%</span>
                    </TableCell>
                    <TableCell>{alert.total_bounces} / {alert.total_sends}</TableCell>
                    <TableCell>{alert.flagged_count} emails</TableCell>
                    <TableCell>
                      {alert.acknowledged_at ? (
                        <Badge variant="default">Acknowledged</Badge>
                      ) : (
                        <Badge variant="destructive">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!alert.acknowledged_at && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedAlert && (
              <div className="mt-4 p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">Acknowledge Alert</h3>
                <Textarea
                  placeholder="Add notes about actions taken..."
                  value={alertNotes}
                  onChange={(e) => setAlertNotes(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={() => acknowledgeAlert(selectedAlert)}>
                    Acknowledge
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

    </div>
  );
}
