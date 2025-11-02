# Live Chat Widget System

## Overview
AlaskaPay now includes a comprehensive live chat widget that appears on all pages, enabling instant communication between users and support agents.

## Features Implemented

### 1. Database Tables
- **chat_agents**: Agent profiles with availability status (online, offline, busy, away)
- **chat_conversations**: Chat session tracking with status and routing
- **chat_messages**: Individual messages with file sharing support
- **chat_typing_indicators**: Real-time typing status

### 2. Edge Functions
- **start-chat**: Initiates conversation with automatic agent assignment
- **send-chat-message**: Sends messages with real-time updates
- **convert-chat-to-ticket**: Converts chat to support ticket with transcript

### 3. UI Components
- **ChatWidget**: Floating button with unread badge and agent status
- **ChatWindow**: Full chat interface with message history
- **ChatMessage**: Individual message bubbles with timestamps
- **TypingIndicator**: Animated typing indicator
- **EmojiPicker**: Emoji selection for messages

### 4. Key Features
- ✅ Real-time messaging via Supabase subscriptions
- ✅ Typing indicators with auto-clear
- ✅ Emoji support
- ✅ File sharing capability
- ✅ Agent availability status
- ✅ Automatic agent routing
- ✅ Chat history
- ✅ Convert to ticket functionality
- ✅ Appears on all pages (home, dashboard, admin, profile)

## Usage

### For Users
1. Click the floating chat button (bottom-right corner)
2. Chat window opens automatically
3. Type messages and press Enter or click Send
4. See agent typing indicators in real-time
5. Add emojis using the smile button
6. Chat history is preserved

### For Agents
Agents need to be added to the `chat_agents` table:

```sql
INSERT INTO chat_agents (user_id, name, email, status, specializations)
VALUES (
  'agent-user-id',
  'John Doe',
  'john@alaskapay.com',
  'online',
  ARRAY['billing', 'technical']
);
```

### Converting Chat to Ticket
```javascript
await supabase.functions.invoke('convert-chat-to-ticket', {
  body: {
    conversationId: 'chat-id',
    categoryId: 'category-id',
    priority: 'high'
  }
});
```

## Real-time Features

### Message Subscription
```javascript
supabase
  .channel(`chat:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    // Handle new message
  })
  .subscribe();
```

### Typing Indicators
```javascript
// Set typing
await supabase
  .from('chat_typing_indicators')
  .upsert({
    conversation_id: conversationId,
    user_id: userId,
    is_typing: true
  });

// Clear after 3 seconds
setTimeout(() => {
  supabase
    .from('chat_typing_indicators')
    .delete()
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);
}, 3000);
```

## Agent Routing
The system automatically assigns available agents based on:
1. Online status
2. Current chat count vs max concurrent chats
3. Specializations (future enhancement)

## Integration Points
- Integrated into all views via AppLayout.tsx
- Works with existing support ticket system
- Uses existing SendGrid for notifications
- Leverages Supabase real-time subscriptions

## Next Steps
1. Add agent admin panel for managing availability
2. Implement chat routing rules based on topics
3. Add file upload functionality
4. Create chat analytics dashboard
5. Add canned responses for agents
6. Implement chat transfer between agents
