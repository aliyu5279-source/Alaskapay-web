import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Search, CheckCheck, Smartphone, AlertTriangle, DollarSign, Key, AtSign, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  metadata: any;
  sent_at: string;
  read_at: string | null;
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('notification_type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notification_history')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getIcon = (type: string) => {
    const icons: any = {
      new_device_login: Smartphone,
      failed_login: AlertTriangle,
      large_transaction: DollarSign,
      password_change: Key,
      email_change: AtSign,
      two_factor_change: ShieldCheck
    };
    return icons[type] || Bell;
  };

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification History</CardTitle>
        <CardDescription>View all security alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="new_device_login">New Device</SelectItem>
              <SelectItem value="failed_login">Failed Login</SelectItem>
              <SelectItem value="large_transaction">Large Transaction</SelectItem>
              <SelectItem value="password_change">Password Change</SelectItem>
              <SelectItem value="email_change">Email Change</SelectItem>
              <SelectItem value="two_factor_change">2FA Change</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notifications found</p>
          </div>
        ) : (

          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.notification_type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read_at ? 'bg-white' : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.read_at && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.sent_at), { addSuffix: true })}
                        </span>
                        {!notification.read_at && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="h-7 text-xs"
                          >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
