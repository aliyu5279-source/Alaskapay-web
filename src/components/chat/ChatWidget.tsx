import { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatWindow } from './ChatWindow';
import { supabase } from '@/lib/supabase';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    checkAgentAvailability();
    const interval = setInterval(checkAgentAvailability, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkAgentAvailability = async () => {
    const { data } = await supabase
      .from('chat_agents')
      .select('status')
      .eq('status', 'online')
      .limit(1);
    
    setAgentStatus(data && data.length > 0 ? 'online' : 'offline');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-20 right-4 z-50 ${isMinimized ? 'hidden' : ''}`}>
          <ChatWindow
            conversationId={conversationId}
            onConversationStart={setConversationId}
            onClose={() => setIsOpen(false)}
            onMinimize={() => setIsMinimized(true)}
          />
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleOpen}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
        {agentStatus === 'online' && (
          <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
    </>
  );
}