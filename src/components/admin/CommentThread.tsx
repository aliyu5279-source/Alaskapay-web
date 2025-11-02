import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  resolved: boolean;
  created_at: string;
  profiles?: { email: string };
}

interface CommentThreadProps {
  reportId: string;
  sectionId: string;
}

export function CommentThread({ reportId, sectionId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
    const channel = supabase
      .channel(`comments:${sectionId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'report_comments', filter: `section_id=eq.${sectionId}` },
        () => loadComments()
      )
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [sectionId]);

  const loadComments = async () => {
    const { data } = await supabase
      .from('report_comments')
      .select('*, profiles(email)')
      .eq('report_id', reportId)
      .eq('section_id', sectionId)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const { error } = await supabase.functions.invoke('manage-report-comments', {
      body: { action: 'create', reportId, sectionId, content: newComment }
    });
    if (error) {
      toast({ title: 'Error', description: 'Failed to add comment', variant: 'destructive' });
    } else {
      setNewComment('');
      toast({ title: 'Comment added' });
    }
  };

  const toggleResolve = async (commentId: string, resolved: boolean) => {
    await supabase.functions.invoke('manage-report-comments', {
      body: { action: 'resolve', commentId, resolved: !resolved }
    });
  };

  const unresolvedCount = comments.filter(c => !c.resolved).length;

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
        <MessageSquare className="h-4 w-4 mr-2" />
        {unresolvedCount > 0 && <Badge variant="destructive" className="ml-2">{unresolvedCount}</Badge>}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 top-10 w-80 p-4 z-50 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className={`p-2 rounded ${c.resolved ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{c.profiles?.email?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{c.profiles?.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleResolve(c.id, c.resolved)}>
                    {c.resolved ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                  </Button>
                </div>
                <p className="text-sm mt-1">{c.content}</p>
              </div>
            ))}
            <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add comment..." />
            <Button onClick={addComment} size="sm">Add</Button>
          </div>
        </Card>
      )}
    </div>
  );
}