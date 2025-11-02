import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface TicketDetailModalProps {
  ticket: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function TicketDetailModal({ ticket, open, onOpenChange, onUpdate }: TicketDetailModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadMessages();
      getCurrentUser();
      subscribeToMessages();
    }
  }, [open, ticket.id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('support_messages')
      .select('*, profiles!support_messages_user_id_fkey(full_name, email)')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`ticket-${ticket.id}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${ticket.id}` },
        () => loadMessages()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke('send-support-message', {
        body: { ticketId: ticket.id, message: newMessage },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (error) throw error;

      setNewMessage('');
      onUpdate?.();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{ticket.ticket_number}</span>
            <Badge>{ticket.status}</Badge>
          </DialogTitle>
          <p className="text-sm text-gray-600">{ticket.subject}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Original Request</p>
              <p className="text-sm">{ticket.description}</p>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.user_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${msg.user_id === currentUser?.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                  <p className="text-xs mb-1 opacity-70">{msg.profiles?.full_name || 'Support Agent'}</p>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            rows={2}
          />
          <Button onClick={handleSendMessage} disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}