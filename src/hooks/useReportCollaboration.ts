import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Operation, TextOperation, transform, applyOperation, invertOperation } from '@/lib/operationalTransform';


export interface CollaboratorPresence {
  user_id: string;
  user_name: string;
  user_email: string;
  cursor_position?: { x: number; y: number };
  selected_field?: string;
  color: string;
  last_seen: string;
}

export interface ReportEdit {
  user_id: string;
  field: string;
  value: any;
  timestamp: string;
  version: number;
  operation?: Operation; // OT operation for text fields
}

interface PendingOperation {
  operation: Operation;
  field: string;
  baseVersion: number;
}

export function useReportCollaboration(reportId: string | null) {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [liveEdits, setLiveEdits] = useState<ReportEdit[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [localVersion, setLocalVersion] = useState(0);
  const pendingOps = useRef<PendingOperation[]>([]);
  const serverVersion = useRef(0);

  const userColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getUserColor = (userId: string) => {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return userColors[hash % userColors.length];
  };

  // Transform pending operations against a server operation
  const transformPendingOps = useCallback((serverOp: Operation, field: string) => {
    pendingOps.current = pendingOps.current.map(pending => {
      if (pending.field !== field) return pending;
      
      const transformedOp = transform(pending.operation, serverOp, 'left');
      return { ...pending, operation: transformedOp };
    });
  }, []);

  // Apply a transformed operation from another client
  const applyRemoteOperation = useCallback((edit: ReportEdit, currentValue: string): string => {
    if (!edit.operation) return edit.value;

    // Transform against all pending operations
    let transformedOp = edit.operation;
    pendingOps.current.forEach(pending => {
      if (pending.field === edit.field) {
        transformedOp = transform(transformedOp, pending.operation, 'right');
      }
    });

    return applyOperation(currentValue, transformedOp);
  }, []);



  useEffect(() => {
    if (!reportId) return;

    const setupCollaboration = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const collaborationChannel = supabase.channel(`report:${reportId}`, {
        config: { presence: { key: user.id } }
      });

      // Track presence
      collaborationChannel
        .on('presence', { event: 'sync' }, () => {
          const state = collaborationChannel.presenceState();
          const users: CollaboratorPresence[] = [];
          
          Object.keys(state).forEach((key) => {
            const presences = state[key] as any[];
            presences.forEach((presence) => {
              users.push({
                ...presence,
                color: getUserColor(presence.user_id)
              });
            });
          });
          
          setCollaborators(users);
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('User joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('User left:', leftPresences);
        })
        .on('broadcast', { event: 'edit' }, ({ payload }) => {
          const edit = payload as ReportEdit;
          
          // If this edit has an OT operation, transform pending ops
          if (edit.operation) {
            transformPendingOps(edit.operation, edit.field);
          }
          
          // Update server version
          if (edit.version > serverVersion.current) {
            serverVersion.current = edit.version;
          }
          
          setLiveEdits((prev) => [...prev.slice(-50), edit]);
        })

        .on('broadcast', { event: 'cursor' }, ({ payload }) => {
          setCollaborators((prev) =>
            prev.map((c) =>
              c.user_id === payload.user_id
                ? { ...c, cursor_position: payload.position }
                : c
            )
          );
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await collaborationChannel.track({
              user_id: user.id,
              user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
              user_email: user.email || '',
              last_seen: new Date().toISOString()
            });
          }
        });

      setChannel(collaborationChannel);
    };

    setupCollaboration();

    return () => {
      channel?.unsubscribe();
    };
  }, [reportId]);

  const broadcastEdit = useCallback(async (field: string, value: any, operation?: Operation) => {
    if (!channel) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const edit: ReportEdit = {
      user_id: user.id,
      field,
      value,
      timestamp: new Date().toISOString(),
      version: localVersion + 1,
      operation
    };

    // Add to pending operations if it's an OT operation
    if (operation) {
      pendingOps.current.push({
        operation,
        field,
        baseVersion: localVersion
      });
    }

    await channel.send({
      type: 'broadcast',
      event: 'edit',
      payload: edit
    });

    setLocalVersion((v) => v + 1);

    // Remove from pending once acknowledged (simplified - in production use acks)
    if (operation) {
      setTimeout(() => {
        pendingOps.current = pendingOps.current.filter(
          op => !(op.operation === operation && op.field === field)
        );
      }, 100);
    }
  }, [channel, localVersion]);


  const broadcastCursor = useCallback(async (x: number, y: number) => {
    if (!channel) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: { user_id: user.id, position: { x, y } }
    });
  }, [channel]);

  const updatePresence = useCallback(async (updates: Partial<CollaboratorPresence>) => {
    if (!channel) return;
    await channel.track(updates);
  }, [channel]);

  // Helper to create text operations from string changes
  const createTextOperation = useCallback((
    oldText: string,
    newText: string,
    cursorPos: number
  ): Operation | null => {
    if (oldText === newText) return null;

    // Detect insert
    if (newText.length > oldText.length) {
      const insertPos = cursorPos - (newText.length - oldText.length);
      const insertedText = newText.slice(insertPos, cursorPos);
      return { type: 'insert', position: insertPos, text: insertedText };
    }

    // Detect delete
    if (newText.length < oldText.length) {
      const deleteLength = oldText.length - newText.length;
      return { type: 'delete', position: cursorPos, length: deleteLength };
    }

    return null;
  }, []);

  return {
    collaborators,
    liveEdits,
    broadcastEdit,
    broadcastCursor,
    updatePresence,
    localVersion,
    applyRemoteOperation,
    createTextOperation
  };
}
