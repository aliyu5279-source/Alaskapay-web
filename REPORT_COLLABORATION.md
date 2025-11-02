# Report Collaboration System

## Overview
Real-time collaboration features for the custom report builder, allowing multiple admins to work together on reports with live presence tracking, comments, version history, and conflict resolution.

## Features

### 1. Real-Time Presence
- **Live User Tracking**: See who else is viewing/editing the report
- **User Avatars**: Display collaborator avatars with email initials
- **Active User Count**: Badge showing number of active collaborators
- **Presence Updates**: Real-time updates using Supabase Realtime channels

### 2. Comment System
- **Section Comments**: Add comments to specific report sections
- **Thread Management**: View and reply to comments in threads
- **Resolve/Unresolve**: Mark comments as resolved when addressed
- **Real-Time Updates**: Comments sync instantly across all users
- **Unresolved Badge**: Visual indicator for sections with open comments

### 3. Version History
- **Automatic Versioning**: Save versions when reports are updated
- **Version Metadata**: Track version number, description, timestamp, creator
- **Version Restore**: Revert to any previous version
- **Configuration Snapshots**: Full section and branding state saved per version
- **Version Comparison**: View what changed between versions

### 4. Conflict Resolution
- **Last-Write-Wins**: Simple conflict resolution strategy
- **Real-Time Sync**: Changes broadcast immediately to all collaborators
- **Visual Feedback**: Toast notifications for save/restore actions

## Database Schema

### report_comments
```sql
- id: UUID (primary key)
- report_id: UUID (foreign key to custom_report_templates)
- section_id: TEXT (section identifier)
- user_id: UUID (foreign key to auth.users)
- content: TEXT (comment text)
- resolved: BOOLEAN (resolution status)
- resolved_by: UUID (who resolved it)
- resolved_at: TIMESTAMPTZ (when resolved)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### report_versions
```sql
- id: UUID (primary key)
- report_id: UUID (foreign key to custom_report_templates)
- version_number: INTEGER (incremental version)
- name: TEXT (version name)
- description: TEXT (version description)
- configuration: JSONB (full report config snapshot)
- branding: JSONB (branding settings)
- created_by: UUID (version creator)
- created_at: TIMESTAMPTZ
```

### report_collaboration_sessions
```sql
- id: UUID (primary key)
- report_id: UUID (foreign key to custom_report_templates)
- user_id: UUID (foreign key to auth.users)
- cursor_position: JSONB (cursor coordinates)
- last_seen: TIMESTAMPTZ (last activity timestamp)
- UNIQUE(report_id, user_id)
```

## Edge Functions

### manage-report-comments
Handles comment operations:
- **create**: Add new comment to section
- **resolve**: Mark comment as resolved/unresolved

**Request Body**:
```json
{
  "action": "create",
  "reportId": "uuid",
  "sectionId": "section-123",
  "content": "Comment text"
}
```

## React Hooks

### useReportCollaboration
Custom hook for real-time collaboration features:

```typescript
const { collaborators, updateCursor } = useReportCollaboration(reportId);
```

**Returns**:
- `collaborators`: Array of active users with presence data
- `updateCursor`: Function to update cursor position

**Features**:
- Subscribes to Supabase Realtime channel
- Tracks user presence automatically
- Handles join/leave events
- Provides cursor position updates

## UI Components

### CommentThread
Displays comments for a report section:
- Comment list with user avatars
- Add new comment textarea
- Resolve/unresolve buttons
- Unresolved count badge
- Real-time updates via Supabase subscriptions

### Version History Dialog
Modal showing all report versions:
- Version list with metadata
- Restore button for each version
- Timestamp and creator info
- Version descriptions

### Presence Indicator
Shows active collaborators:
- User avatar stack
- Active user count badge
- Hover tooltips with user emails

## Usage

### Enable Collaboration
When saving a report, it automatically:
1. Creates initial version
2. Sets up collaboration channel
3. Enables presence tracking

### Add Comments
1. Click comment button on any section
2. Type comment in textarea
3. Click "Add" to post
4. Comments sync to all users instantly

### View Version History
1. Click "Versions" button in toolbar
2. Browse all saved versions
3. Click "Restore" to revert to any version
4. Confirm restoration

### Monitor Collaborators
- Active users shown in top toolbar
- Avatar stack displays all present users
- Badge shows total count
- Updates in real-time as users join/leave

## Best Practices

1. **Save Frequently**: Create versions at major milestones
2. **Descriptive Comments**: Provide context for feedback
3. **Resolve Comments**: Mark as resolved when addressed
4. **Version Descriptions**: Add meaningful descriptions when saving
5. **Check Presence**: Verify who's editing before major changes

## Technical Details

### Real-Time Architecture
- Uses Supabase Realtime Presence feature
- WebSocket connections for live updates
- Automatic reconnection on disconnect
- Efficient delta updates

### Conflict Resolution
- Last-write-wins strategy
- No locking mechanism (optimistic concurrency)
- Toast notifications for conflicts
- Version history allows recovery

### Performance
- Efficient presence tracking (minimal bandwidth)
- Comment pagination for large threads
- Lazy loading of version history
- Debounced cursor updates

## Future Enhancements
- Cursor position visualization on canvas
- Operational transformation for true concurrent editing
- Comment mentions (@user)
- Comment reactions (emoji)
- Conflict detection and merge tools
- Export comments to PDF reports
- Comment search and filtering
