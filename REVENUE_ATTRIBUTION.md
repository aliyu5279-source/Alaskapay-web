# Revenue Attribution System

Track which segments, campaigns, and email templates drive the most revenue for your business.

## Overview

The Revenue Attribution System connects Stripe payments to your email marketing efforts, providing insights into:
- Revenue by user segment
- Campaign ROI and performance
- Customer lifetime value (CLV)
- Conversion rates and attribution
- Top revenue-generating customers

## Database Tables

### revenue_events
Tracks individual revenue transactions and their attribution:
- `stripe_payment_id`: Unique Stripe payment identifier
- `amount`: Transaction amount
- `segment_ids`: Array of segment IDs the user belongs to
- `campaign_id`: Associated email campaign
- `template_id`: Email template used
- `conversion_source`: How the user converted (email_click, direct, etc.)

### customer_lifetime_value
Aggregates customer revenue over time:
- `total_revenue`: Total revenue from customer
- `transaction_count`: Number of purchases
- `average_order_value`: AOV calculation
- `primary_segment_id`: Customer's main segment
- `acquisition_campaign_id`: Campaign that acquired the customer

### segment_revenue_attribution
Period-based segment performance:
- `period_start/end`: Date range for analysis
- `total_revenue`: Revenue from segment in period
- `conversion_rate`: Segment conversion percentage
- `unique_customers`: Number of paying customers

### campaign_revenue_attribution
Campaign-level revenue tracking:
- `total_revenue`: Total revenue attributed to campaign
- `revenue_per_email`: Revenue per email sent
- `roi`: Return on investment calculation
- `campaign_cost`: Cost to run campaign

## Edge Functions

### track-revenue-event
Records revenue events from Stripe webhooks or manual tracking.

**Usage:**
```javascript
const { data, error } = await supabase.functions.invoke('track-revenue-event', {
  body: {
    userId: 'user-uuid',
    stripePaymentId: 'pi_xxx',
    amount: 99.99,
    currency: 'USD',
    emailSendId: 'email-send-uuid', // optional
    conversionSource: 'email_click' // or 'direct', 'organic', etc.
  }
});
```

### get-revenue-analytics
Retrieves comprehensive revenue analytics.

**Usage:**
```javascript
const { data, error } = await supabase.functions.invoke('get-revenue-analytics', {
  body: {
    timeRange: '30d', // '7d', '30d', '90d', '365d'
    segmentId: 'segment-uuid', // optional
    campaignId: 'campaign-uuid' // optional
  }
});

// Returns:
{
  overview: {
    total_revenue: 12500.00,
    transaction_count: 125,
    average_order_value: 100.00
  },
  revenue_by_segment: [...],
  revenue_by_campaign: [...],
  top_customers: [...]
}
```

## Admin Dashboard

Navigate to **Admin Panel → Revenue Attribution** to view:

### Key Metrics
- Total Revenue
- Transaction Count
- Average Order Value
- Top Customer Count

### Revenue by Segment
Bar chart showing which segments generate the most revenue.

### Revenue by Campaign
Pie chart displaying campaign revenue distribution.

### Time Range Filters
- Last 7 days
- Last 30 days
- Last 90 days
- Last year

## Integration with Stripe

### Webhook Setup
1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/track-revenue-event`
3. Select events: `payment_intent.succeeded`
4. Copy webhook signing secret

### Processing Payments
When a payment succeeds, call the track-revenue-event function:

```javascript
// In your Stripe webhook handler
if (event.type === 'payment_intent.succeeded') {
  const paymentIntent = event.data.object;
  
  await supabase.functions.invoke('track-revenue-event', {
    body: {
      userId: paymentIntent.metadata.user_id,
      stripePaymentId: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert cents to dollars
      currency: paymentIntent.currency,
      emailSendId: paymentIntent.metadata.email_send_id,
      conversionSource: paymentIntent.metadata.source || 'direct'
    }
  });
}
```

## Attribution Logic

### Segment Attribution
- User's current segments are captured at time of purchase
- Revenue is attributed to ALL segments the user belongs to
- Allows multi-segment analysis

### Campaign Attribution
- If purchase follows email click, campaign is attributed
- Attribution window: 7 days from email send
- Last-touch attribution model

### CLV Calculation
- Automatically updates on each purchase
- Tracks first and last purchase dates
- Calculates running average order value
- Associates primary segment and acquisition campaign

## Best Practices

1. **Track Email Clicks**: Include email_send_id in payment metadata
2. **Set Conversion Source**: Differentiate between email, direct, organic
3. **Regular Analysis**: Review attribution weekly/monthly
4. **Segment Testing**: Compare revenue across different segments
5. **Campaign ROI**: Track campaign costs for accurate ROI calculations

## Analytics Queries

### Top Revenue Segments
```sql
SELECT 
  s.name,
  SUM(r.amount) as total_revenue,
  COUNT(DISTINCT r.user_id) as unique_customers
FROM revenue_events r
CROSS JOIN UNNEST(r.segment_ids) AS segment_id
JOIN user_segments s ON s.id = segment_id
GROUP BY s.name
ORDER BY total_revenue DESC;
```

### Campaign ROI
```sql
SELECT 
  c.name,
  cr.total_revenue,
  cr.campaign_cost,
  cr.roi,
  cr.revenue_per_email
FROM campaign_revenue_attribution cr
JOIN email_campaigns c ON c.id = cr.campaign_id
ORDER BY cr.roi DESC;
```

## Future Enhancements

- Multi-touch attribution modeling
- Cohort analysis by acquisition date
- Predictive CLV calculations
- Revenue forecasting
- A/B test revenue comparison
- Automated ROI alerts
