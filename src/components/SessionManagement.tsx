import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Tablet, MapPin, Clock, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface Session {
  id: string;
  device_info: { browser: string; os: string };
  ip_address: string;
  location: string;
  last_active_at: string;
  created_at: string;
  session_token: string;
}

export function SessionManagement() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSessionToken] = useState(localStorage.getItem('session_token') || '');

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-sessions', {
        body: { action: 'list', userId: user.id }
      });

      if (error) throw error;
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-sessions', {
        body: { action: 'revoke', userId: user?.id, sessionId }
      });

      if (error) throw error;
      toast.success('Session revoked successfully');
      loadSessions();
    } catch (error) {
      console.error('Error revoking session:', error);
      toast.error('Failed to revoke session');
    }
  };

  const getDeviceIcon = (os: string) => {
    if (os.includes('Android') || os.includes('iOS')) return <Smartphone className="h-5 w-5" />;
    if (os.includes('Tablet')) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Active Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Manage your active sessions across all devices
        </p>
      </div>

      {sessions.map((session) => {
        const isCurrent = session.session_token === currentSessionToken;
        
        return (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(session.device_info.os)}
                  <div>
                    <CardTitle className="text-base">
                      {session.device_info.browser} on {session.device_info.os}
                    </CardTitle>
                    {isCurrent && (
                      <Badge variant="secondary" className="mt-1">Current Session</Badge>
                    )}
                  </div>
                </div>
                {!isCurrent && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => revokeSession(session.id)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Revoke
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{session.location} • {session.ip_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last active: {formatDate(session.last_active_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
