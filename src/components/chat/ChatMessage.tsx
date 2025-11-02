import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageProps {
  message: {
    id: string;
    sender_type: 'user' | 'agent' | 'system';
    message: string;
    message_type: string;
    file_url?: string;
    file_name?: string;
    created_at: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const isOwn = message.sender_type === 'user';
  const isSystem = message.sender_type === 'system';

  if (isSystem) {
    return (
      <div className="text-center text-xs text-muted-foreground py-2">
        {message.message}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2', isOwn && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {isOwn ? user?.email?.[0].toUpperCase() : 'A'}
        </AvatarFallback>
      </Avatar>
      <div className={cn('flex flex-col gap-1 max-w-[70%]', isOwn && 'items-end')}>
        <div className={cn(
          'rounded-lg px-4 py-2',
          isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}>
          {message.message_type === 'file' && message.file_url ? (
            <a 
              href={message.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline"
            >
              {message.file_name}
            </a>
          ) : (
            <p className="text-sm">{message.message}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(message.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}