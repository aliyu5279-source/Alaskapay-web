import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { MessageSquare } from 'lucide-react';

export function MyFeedback() {
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('beta_feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setFeedback(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Feedback</h2>
      {feedback.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No feedback submitted yet</p>
          </CardContent>
        </Card>
      ) : (
        feedback.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{item.category}</CardTitle>
                  <CardDescription>{new Date(item.created_at).toLocaleDateString()}</CardDescription>
                </div>
                <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{item.feedback}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{item.priority}</Badge>
                <Badge variant="outline">{item.app_version}</Badge>
              </div>
              {item.screenshot_url && (
                <img src={item.screenshot_url} className="mt-2 rounded border max-w-xs" />
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
