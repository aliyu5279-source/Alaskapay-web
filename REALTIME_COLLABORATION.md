# Real-Time Collaborative Editing

This guide covers the real-time collaboration features for the report builder, including live cursors, presence indicators, and conflict resolution.

## Features

### 1. Live Presence Tracking
- See who's currently editing the report
- Real-time avatars with user names
- Color-coded presence indicators
- Last activity timestamps

### 2. Live Cursors
- See other users' cursor positions in real-time
- Smooth cursor animations
- User name labels on cursors
- Color-coded for easy identification

### 3. Broadcast Edits
- Real-time synchronization of changes
- Field-level edit tracking
- Version conflict detection
- Automatic merge resolution

### 4. Conflict Resolution
- Version numbering for all edits
- Last-write-wins strategy
- Edit history tracking
- Rollback capabilities

## Architecture

### Supabase Realtime Channels
```typescript
const channel = supabase.channel(`report:${reportId}`, {
  config: { presence: { key: user.id } }
});
```

### Presence Tracking
```typescript
await channel.track({
  user_id: user.id,
  user_name: user.user_metadata?.full_name,
  user_email: user.email,
  last_seen: new Date().toISOString()
});
```

### Broadcasting Edits
```typescript
await channel.send({
  type: 'broadcast',
  event: 'edit',
  payload: {
    user_id: user.id,
    field: 'report_name',
    value: 'New Report Name',
    timestamp: new Date().toISOString(),
    version: localVersion + 1
  }
});
```

### Cursor Broadcasting
```typescript
await channel.send({
  type: 'broadcast',
  event: 'cursor',
  payload: {
    user_id: user.id,
    position: { x: clientX, y: clientY }
  }
});
```

## Components

### useReportCollaboration Hook
Custom hook that manages all collaboration features:
- Presence tracking
- Live cursor updates
- Edit broadcasting
- Conflict resolution

**Usage:**
```typescript
const {
  collaborators,
  liveEdits,
  broadcastEdit,
  broadcastCursor,
  updatePresence,
  localVersion
} = useReportCollaboration(reportId);
```

### CollaboratorPresence Component
Displays active collaborators with avatars and status:
```tsx
<CollaboratorPresence collaborators={collaborators} />
```

### LiveCursor Component
Renders live cursors from other users:
```tsx
<LiveCursor collaborators={collaborators} />
```

## Database Schema

### report_collaboration_sessions
Tracks active editing sessions:
- `report_id`: Report being edited
- `user_id`: User in session
- `session_start`: When session started
- `last_activity`: Last activity timestamp
- `cursor_position`: Current cursor position
- `selected_field`: Currently selected field

### report_edit_history
Tracks all edits for conflict resolution:
- `report_id`: Report being edited
- `user_id`: User making edit
- `field_name`: Field being edited
- `old_value`: Previous value
- `new_value`: New value
- `version_number`: Edit version
- `conflict_resolved`: Whether conflict was resolved

## Conflict Resolution Strategy

### Last-Write-Wins
The system uses a last-write-wins strategy with version tracking:

1. Each edit increments the local version number
2. Edits are broadcast with version information
3. Receiving clients check version numbers
4. If version conflicts, last edit wins
5. Conflict is logged in edit_history

### Manual Resolution
For critical conflicts, users can:
1. View edit history
2. See conflicting changes
3. Choose which version to keep
4. Restore from version history

## Best Practices

### 1. Throttle Cursor Updates
```typescript
const throttledCursor = throttle((x, y) => {
  broadcastCursor(x, y);
}, 50); // Update every 50ms
```

### 2. Debounce Text Edits
```typescript
const debouncedEdit = debounce((field, value) => {
  broadcastEdit(field, value);
}, 500); // Wait 500ms after typing stops
```

### 3. Handle Disconnections
```typescript
channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
  console.log('User disconnected:', leftPresences);
  // Clean up their cursors and selections
});
```

### 4. Optimize Presence Updates
Only update presence when meaningful changes occur:
```typescript
if (selectedField !== previousField) {
  updatePresence({ selected_field: selectedField });
}
```

## Security Considerations

### Row Level Security (RLS)
- Users can only see sessions for reports they have access to
- Edit history is visible to all collaborators
- Only users can update their own session data

### Rate Limiting
Consider implementing rate limits for:
- Cursor position updates (max 20/second)
- Edit broadcasts (max 10/second)
- Presence updates (max 1/second)

## Performance Optimization

### 1. Limit Active Collaborators Display
Show only first 5 collaborators, with "+X more" indicator

### 2. Cursor Position Throttling
Update cursor positions max 20 times per second

### 3. Edit History Cleanup
Periodically clean up old edit history:
```sql
DELETE FROM report_edit_history
WHERE edit_timestamp < NOW() - INTERVAL '30 days';
```

### 4. Session Cleanup
Clean up inactive sessions:
```sql
UPDATE report_collaboration_sessions
SET session_end = NOW()
WHERE last_activity < NOW() - INTERVAL '5 minutes'
AND session_end IS NULL;
```

## Testing Collaboration

### Multi-User Testing
1. Open report in multiple browser windows
2. Log in as different users
3. Make edits simultaneously
4. Verify real-time updates
5. Test conflict resolution

### Network Conditions
Test under various conditions:
- High latency
- Packet loss
- Disconnections
- Reconnections

## Troubleshooting

### Cursors Not Appearing
- Check Realtime connection status
- Verify channel subscription
- Check browser console for errors

### Edits Not Syncing
- Verify broadcast permissions
- Check version numbers
- Review edit history for conflicts

### Performance Issues
- Reduce cursor update frequency
- Limit number of active sessions
- Clean up old edit history
- Optimize presence updates

## Future Enhancements

1. **Operational Transform**: Implement OT for better conflict resolution
2. **Awareness API**: Show what each user is currently editing
3. **Comment System**: Real-time commenting on report sections
4. **Undo/Redo**: Collaborative undo/redo with conflict handling
5. **Permissions**: Fine-grained editing permissions per user
