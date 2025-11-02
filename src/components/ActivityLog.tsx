import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityLog {
  id: string;
  action_type: string;
  action_details: any;
  ip_address: string;
  device_info: string;
  user_agent: string;
  location: string;
  created_at: string;
}

export function ActivityLog({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-activity-logs', {
        body: { userId, actionType, startDate, endDate }
      });

      if (error) throw error;
      setLogs(data.logs || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [userId, actionType, startDate, endDate]);

  const filteredLogs = logs.filter(log =>
    log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address.includes(searchTerm) ||
    (log.device_info && log.device_info.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActionBadge = (actionType: string) => {
    const colors: any = {
      login: 'bg-green-500',
      logout: 'bg-gray-500',
      transaction: 'bg-blue-500',
      settings: 'bg-purple-500',
      profile: 'bg-orange-500',
      security: 'bg-red-500'
    };
    return colors[actionType] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>View all account activity and security events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End date"
          />
          <Button onClick={fetchLogs} variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Apply
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getActionBadge(log.action_type)}>
                        {log.action_type}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {log.action_details?.description || 'Activity performed'}
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>IP: {log.ip_address}</p>
                      {log.device_info && <p>Device: {log.device_info}</p>}
                      {log.location && <p>Location: {log.location}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No activity logs found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
