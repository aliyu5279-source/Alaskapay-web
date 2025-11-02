# Customer Support System - AlaskaPay

## Overview
Complete customer support system with ticket management, real-time chat, email notifications, and admin tools.

## Database Tables

### support_categories
- Organizes tickets by type (Account, Transaction, Wallet, KYC, etc.)
- 7 default categories with icons and colors
- Sortable and can be activated/deactivated

### support_tickets
- Tracks all customer support requests
- Auto-generated ticket numbers (TKT-000001)
- Status: open, in_progress, waiting_customer, resolved, closed
- Priority: low, medium, high, urgent
- SLA tracking (first_response_at, resolved_at)
- Rating and feedback system

### support_messages
- Conversation thread for each ticket
- User and agent messages
- Support for attachments
- Internal notes (visible only to agents)

### support_canned_responses
- Pre-written responses for common issues
- Categorized by topic
- Keyboard shortcuts
- Usage tracking

## Edge Functions

### create-support-ticket
Creates new support ticket and sends email notification
```typescript
POST /functions/v1/create-support-ticket
Body: {
  categoryId: string,
  subject: string,
  description: string,
  priority: 'low' | 'medium' | 'high' | 'urgent'
}
```

### send-support-message
Sends message in ticket conversation
```typescript
POST /functions/v1/send-support-message
Body: {
  ticketId: string,
  message: string,
  isInternal: boolean,
  attachments: array
}
```

## UI Components

### User-Facing Components

#### SupportDashboard
- Main support interface for users
- Statistics: open tickets, resolved tickets, avg response time
- Tabbed view: All, Open, Resolved tickets

#### CreateTicketModal
- Form to create new support ticket
- Category selection
- Subject and description
- Priority selection

#### TicketList
- Display all user tickets
- Search by ticket number or subject
- Filter by status
- Click to view details

#### TicketDetailModal
- Full ticket conversation view
- Real-time message updates via Supabase subscriptions
- Send new messages
- View ticket status and priority

## Features

### Real-Time Updates
- Supabase subscriptions for instant message delivery
- Live ticket status changes
- No page refresh needed

### Email Notifications
- Ticket created confirmation
- New message from support
- Status change notifications
- Resolution confirmations

### Search & Filters
- Search tickets by number or subject
- Filter by status (open, in progress, resolved, closed)
- Sort by date, priority, or status

### Priority Management
- 4 priority levels with color coding
- Urgent tickets highlighted
- Auto-escalation based on response time

### SLA Tracking
- First response time tracking
- Resolution time tracking
- Performance metrics for support team

## Integration

### In Dashboard
Support tab added to main dashboard:
```typescript
<TabsTrigger value="support">Support</TabsTrigger>
<TabsContent value="support">
  <SupportDashboard />
</TabsContent>
```

### Usage Example
```typescript
// User creates ticket
const { data } = await supabase.functions.invoke('create-support-ticket', {
  body: {
    categoryId: 'category-uuid',
    subject: 'Cannot withdraw funds',
    description: 'Getting error when trying to withdraw',
    priority: 'high'
  }
});

// Send message
await supabase.functions.invoke('send-support-message', {
  body: {
    ticketId: 'ticket-uuid',
    message: 'I tried again but still getting the same error'
  }
});
```

## Admin Features (Future Enhancement)
- Ticket assignment to agents
- Canned response management
- Performance analytics
- Bulk ticket operations
- Advanced filtering and reporting

## Security
- Row Level Security (RLS) enabled
- Users can only view their own tickets
- Agents can view assigned tickets
- Admins have full access
- Internal notes hidden from customers

## Best Practices
1. Respond to tickets within 2 hours
2. Use canned responses for common issues
3. Update ticket status regularly
4. Add internal notes for context
5. Request feedback after resolution
6. Monitor SLA metrics

## Email Templates
All emails sent via SendGrid with professional formatting:
- Ticket created confirmation
- New message notification
- Status change updates
- Resolution confirmation

## Future Enhancements
- File attachment support
- Video/screen recording
- Live chat widget
- AI-powered auto-responses
- Knowledge base integration
- Customer satisfaction surveys
- Multi-language support
