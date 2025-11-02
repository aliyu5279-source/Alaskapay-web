import { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  priority: string;
  action_url: string | null;
  is_read: boolean;
  is_clicked: boolean;
  sent_at: string;
}

export function PushNotificationHistory() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from('push_notification_history')
      .select('*')
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (filter === 'unread') {
      query = query.eq('is_read', false);
    }

    const { data } = await query;
    setNotifications(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('push_notification_history')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);
    
    loadNotifications();
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('push_notification_history')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    loadNotifications();
    toast.success('All notifications marked as read');
  };

  const deleteNotification = async (id: string) => {
    await supabase
      .from('push_notification_history')
      .delete()
      .eq('id', id);
    
    loadNotifications();
    toast.success('Notification deleted');
  };

  const handleAction = async (notification: Notification) => {
    if (notification.action_url) {
      await supabase
        .from('push_notification_history')
        .update({ is_clicked: true, clicked_at: new Date().toISOString() })
        .eq('id', notification.id);
      
      window.open(notification.action_url, '_blank');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'failed-transactions': 'destructive',
      'security-alerts': 'destructive',
      'high-value-payments': 'default',
      'system-errors': 'destructive',
      'user-reports': 'secondary',
      'new-user-signups': 'default'
    };
    return colors[type] || 'secondary';
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <Check className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <Card key={notification.id} className={!notification.is_read ? 'border-primary' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getTypeColor(notification.type) as any}>
                      {notification.type.replace(/-/g, ' ')}
                    </Badge>
                    {notification.priority === 'high' && (
                      <Badge variant="destructive">High Priority</Badge>
                    )}
                    {!notification.is_read && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <h4 className="font-semibold">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">{notification.body}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.sent_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {notification.action_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(notification)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
