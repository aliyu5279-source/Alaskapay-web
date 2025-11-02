# Email Campaign Scheduler

## Overview
The Email Campaign Scheduler allows admins to create, schedule, and manage bulk email campaigns to user segments with performance tracking.

## Database Tables

### email_campaigns
Stores campaign details, templates, recipient filters, and scheduling information.

**Key Fields:**
- `name`, `description`, `subject_line` - Campaign details
- `template_id` - Reference to email template
- `recipient_filters` - JSONB with filter criteria
- `scheduled_at` - When to send the campaign
- `status` - draft, scheduled, sending, sent, paused, cancelled, failed
- Performance metrics: `total_sent`, `total_opened`, `total_clicked`, `total_bounced`

### campaign_recipients
Tracks individual recipient status and engagement.

**Key Fields:**
- `campaign_id`, `user_id`, `email`
- `status` - pending, sent, failed, bounced
- Engagement tracking: `opened_at`, `clicked_at`, `open_count`, `click_count`

## Edge Functions

### manage-campaigns
**Endpoint:** `/functions/v1/manage-campaigns`

**Actions:**
- `create` - Create new campaign with recipient filters
- `list` - Get all campaigns with templates
- `get` - Get single campaign details
- `update` - Update campaign details
- `delete` - Delete campaign

### send-campaign
**Endpoint:** `/functions/v1/send-campaign`

Executes campaign send to all filtered recipients using SendGrid API.

**Process:**
1. Updates campaign status to 'sending'
2. Queries recipients based on filters
3. Creates recipient records
4. Sends emails in batches with variable replacement
5. Updates campaign status and metrics

## Admin Interface

### Campaign Scheduler Tab
Main interface with list view and calendar view.

**Features:**
- Create new campaigns
- View campaign list with status and metrics
- Calendar view of scheduled campaigns
- View detailed campaign analytics

### Campaign Creator
Form to create campaigns with:
- Campaign details (name, description, subject)
- Template selection
- Recipient filters (user status, registration date)
- Scheduling options

### Campaign Details
Shows campaign performance with:
- Key metrics (recipients, sent, open rate, click rate)
- Performance chart
- Campaign details and schedule info
- Send now button for draft campaigns

## Recipient Filters

Campaigns can target users based on:
- **User Status:** Active/Inactive
- **Registration Date:** After/Before specific dates
- **Activity Level:** (Extensible)

## Usage Example

```typescript
// Create a campaign
const { data } = await supabase.functions.invoke('manage-campaigns', {
  body: {
    action: 'create',
    campaignData: {
      name: 'Welcome Campaign',
      subject_line: 'Welcome to Alaska Pay!',
      template_id: 'template-uuid',
      scheduled_at: '2025-10-15T10:00:00Z'
    },
    filters: {
      userStatus: 'active',
      registeredAfter: '2025-10-01'
    }
  }
});

// Send campaign
await supabase.functions.invoke('send-campaign', {
  body: { campaignId: campaign.id }
});
```

## Integration

Campaign scheduler is integrated into AdminDashboard:
- Menu item: "Email Campaigns" 
- Tab ID: `campaign-scheduler`
- Component: `CampaignSchedulerTab`

## Performance Tracking

Campaigns track:
- **Send metrics:** Total sent, delivered, bounced
- **Engagement:** Opens, clicks, unsubscribes
- **Rates:** Open rate %, Click rate %
- **Status:** Real-time campaign status updates

## Future Enhancements
- Advanced segmentation (spending, engagement scores)
- Recurring campaigns
- Automated triggers
- Campaign cloning
- Export campaign reports
