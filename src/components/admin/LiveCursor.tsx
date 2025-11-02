import { CollaboratorPresence } from '@/hooks/useReportCollaboration';
import { MousePointer2 } from 'lucide-react';

interface LiveCursorProps {
  collaborators: CollaboratorPresence[];
}

export function LiveCursor({ collaborators }: LiveCursorProps) {
  return (
    <>
      {collaborators.map((collaborator) => {
        if (!collaborator.cursor_position) return null;

        return (
          <div
            key={collaborator.user_id}
            className="fixed pointer-events-none z-50 transition-all duration-100 ease-out"
            style={{
              left: `${collaborator.cursor_position.x}px`,
              top: `${collaborator.cursor_position.y}px`,
            }}
          >
            <MousePointer2
              className="h-5 w-5 -rotate-90"
              style={{ color: collaborator.color }}
              fill={collaborator.color}
            />
            <div
              className="mt-1 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
              style={{ backgroundColor: collaborator.color }}
            >
              {collaborator.user_name}
            </div>
          </div>
        );
      })}
    </>
  );
}
