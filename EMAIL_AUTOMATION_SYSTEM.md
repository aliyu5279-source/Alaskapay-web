# Email Automation System

Comprehensive automated email campaign system for Alaska Pay that triggers emails based on user actions and events.

## Features

### Trigger Types

1. **New User Registration** - Welcome series for new users
2. **Inactive Users** - Re-engagement campaigns
3. **Transaction Milestones** - Celebrate user achievements
4. **Birthday/Anniversary** - Special occasion emails
5. **Abandoned Cart** - Recovery campaigns

### Rule Builder Interface

Create sophisticated automation rules with:
- Multiple email sequences with delays
- Conditional triggers
- Template selection
- Performance tracking

## Database Schema

### campaign_automation_rules
```sql
- id (UUID, primary key)
- name (TEXT) - Rule name
- description (TEXT) - Rule description
- trigger_type (TEXT) - Type of trigger
- trigger_conditions (JSONB) - Flexible conditions
- email_sequence (JSONB) - Array of email steps
- is_active (BOOLEAN) - Rule status
- created_by (UUID) - Creator user ID
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- last_executed_at (TIMESTAMPTZ)
- total_executions (INTEGER)
- total_emails_sent (INTEGER)
```

### automation_executions
```sql
- id (UUID, primary key)
- rule_id (UUID) - Reference to automation rule
- user_id (UUID) - Target user
- trigger_data (JSONB) - Context data
- sequence_step (INTEGER) - Current step in sequence
- status (TEXT) - pending, sent, failed, cancelled
- scheduled_for (TIMESTAMPTZ) - When to send
- executed_at (TIMESTAMPTZ) - When sent
- email_id (UUID) - Reference to email_sends
- error_message (TEXT)
- created_at (TIMESTAMPTZ)
```

## Edge Functions

### manage-automation-rules
**Endpoint:** `/functions/v1/manage-automation-rules`

Manage automation rules (CRUD operations).

**Actions:**
- `list` - Get all rules
- `get` - Get single rule by ID
- `create` - Create new rule
- `update` - Update existing rule
- `delete` - Delete rule

**Example:**
```javascript
const { data } = await supabase.functions.invoke('manage-automation-rules', {
  body: {
    action: 'create',
    ruleData: {
      name: 'Welcome Series',
      trigger_type: 'new_user',
      email_sequence: [
        { template_id: 'xxx', delay_hours: 0 },
        { template_id: 'yyy', delay_hours: 24 }
      ]
    }
  }
});
```

### execute-automation-triggers
**Endpoint:** `/functions/v1/execute-automation-triggers`

Execute automation triggers for user events.

**Parameters:**
- `triggerType` - Type of trigger
- `userId` - User ID
- `triggerData` - Context data

**Example:**
```javascript
await supabase.functions.invoke('execute-automation-triggers', {
  body: {
    triggerType: 'new_user',
    userId: user.id,
    triggerData: { registration_date: new Date() }
  }
});
```

## Admin Interface

### Automation Rules Tab

Access via Admin Dashboard → Automation Rules

**Features:**
- View all automation rules
- Create/edit/delete rules
- Toggle rules active/inactive
- View execution statistics

### Rule Builder

**Components:**
1. Rule name and description
2. Trigger type selection
3. Condition builder (coming soon)
4. Email sequence builder
   - Select template
   - Set delay in hours
   - Add/remove steps

## Usage Examples

### Welcome Series
```javascript
// Trigger on user signup
await supabase.functions.invoke('execute-automation-triggers', {
  body: {
    triggerType: 'new_user',
    userId: newUser.id,
    triggerData: { 
      registration_date: new Date(),
      source: 'web'
    }
  }
});
```

### Re-engagement Campaign
```javascript
// Check for inactive users daily
const inactiveUsers = await getInactiveUsers(30); // 30 days
for (const user of inactiveUsers) {
  await supabase.functions.invoke('execute-automation-triggers', {
    body: {
      triggerType: 'inactive_user',
      userId: user.id,
      triggerData: { 
        last_active: user.last_active_date,
        days_inactive: 30
      }
    }
  });
}
```

### Transaction Milestone
```javascript
// Trigger on milestone achievement
await supabase.functions.invoke('execute-automation-triggers', {
  body: {
    triggerType: 'transaction_milestone',
    userId: user.id,
    triggerData: { 
      milestone: '10_transactions',
      total_transactions: 10,
      total_amount: 5000
    }
  }
});
```

## Background Job Setup

For production, set up a cron job to process pending executions:

```javascript
// Run every 5 minutes
const { data: pending } = await supabase
  .from('automation_executions')
  .select('*')
  .eq('status', 'pending')
  .lte('scheduled_for', new Date().toISOString());

for (const execution of pending) {
  // Send email via SendGrid
  // Update execution status
}
```

## Best Practices

1. **Test Rules** - Always test with small user segments first
2. **Monitor Performance** - Track open rates and conversions
3. **Respect Preferences** - Honor user notification preferences
4. **Timing** - Consider time zones for scheduled sends
5. **Frequency** - Avoid overwhelming users with too many emails

## Troubleshooting

### Rules Not Triggering
1. Check rule is active
2. Verify trigger conditions match
3. Check email templates exist
4. Review edge function logs

### Emails Not Sending
1. Verify SendGrid API key
2. Check email template is active
3. Review suppression list
4. Check user email preferences

## Security

- RLS policies protect automation data
- Only authenticated users can manage rules
- Service role key required for execution
- Audit logging for all rule changes
