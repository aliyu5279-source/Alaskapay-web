import { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { EmojiPicker } from './EmojiPicker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChatWindowProps {
  conversationId: string | null;
  onConversationStart: (id: string) => void;
  onClose: () => void;
  onMinimize: () => void;
}

export function ChatWindow({ conversationId, onConversationStart, onClose, onMinimize }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [agentName, setAgentName] = useState('Support Team');
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!conversationId && user) {
      startConversation();
    }
  }, [user]);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      subscribeToMessages();
      subscribeToTyping();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('start-chat', {
        body: { topic: 'General Support' }
      });

      if (error) throw error;
      if (data.conversation) {
        onConversationStart(data.conversation.id);
        if (data.agent) {
          setAgentName(data.agent.name);
        }
      }
    } catch (error: any) {
      toast.error('Failed to start chat');
    }
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToTyping = () => {
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_typing_indicators',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        if (payload.new && payload.new.user_id !== user?.id) {
          setIsTyping(payload.new.is_typing);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;

    try {
      await supabase.functions.invoke('send-chat-message', {
        body: {
          conversationId,
          message: message.trim(),
          messageType: 'text'
        }
      });

      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    supabase
      .from('chat_typing_indicators')
      .upsert({
        conversation_id: conversationId,
        user_id: user?.id,
        is_typing: true
      });

    typingTimeoutRef.current = setTimeout(() => {
      supabase
        .from('chat_typing_indicators')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', user?.id);
    }, 3000);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="w-96 h-[600px] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-primary text-primary-foreground">
        <div>
          <h3 className="font-semibold">{agentName}</h3>
          <p className="text-xs opacity-90">Online</p>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={onMinimize}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button size="icon" variant="ghost" onClick={() => setShowEmoji(!showEmoji)}>
            <Smile className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {showEmoji && (
          <EmojiPicker onSelect={(emoji) => {
            setMessage(prev => prev + emoji);
            setShowEmoji(false);
          }} />
        )}
      </div>
    </Card>
  );
}