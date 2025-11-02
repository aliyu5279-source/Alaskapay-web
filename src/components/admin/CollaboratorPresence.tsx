import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CollaboratorPresence as Collaborator } from '@/hooks/useReportCollaboration';
import { Users } from 'lucide-react';

interface CollaboratorPresenceProps {
  collaborators: Collaborator[];
}

export function CollaboratorPresence({ collaborators }: CollaboratorPresenceProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (collaborators.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b">
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {collaborators.length} {collaborators.length === 1 ? 'person' : 'people'} editing
      </span>
      
      <div className="flex -space-x-2 ml-2">
        <TooltipProvider>
          {collaborators.slice(0, 5).map((collaborator) => (
            <Tooltip key={collaborator.user_id}>
              <TooltipTrigger>
                <Avatar 
                  className="h-8 w-8 border-2 border-background"
                  style={{ borderColor: collaborator.color }}
                >
                  <AvatarFallback 
                    style={{ backgroundColor: `${collaborator.color}20`, color: collaborator.color }}
                  >
                    {getInitials(collaborator.user_name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-semibold">{collaborator.user_name}</p>
                  <p className="text-muted-foreground">{collaborator.user_email}</p>
                  <p className="text-muted-foreground">{getTimeAgo(collaborator.last_seen)}</p>
                  {collaborator.selected_field && (
                    <Badge variant="secondary" className="mt-1">
                      Editing: {collaborator.selected_field}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        
        {collaborators.length > 5 && (
          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
            <span className="text-xs font-medium">+{collaborators.length - 5}</span>
          </div>
        )}
      </div>
    </div>
  );
}
