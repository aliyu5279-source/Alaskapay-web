# Segment Analytics Dashboard

## Overview
The Segment Analytics Dashboard provides comprehensive insights into user segment performance, growth trends, engagement metrics, and A/B test results. Admins can analyze segment behavior, track membership changes over time, and export segment data.

## Features

### 1. **Segment Performance Metrics**
- Current segment size (active users)
- Email open rates
- Click-through rates
- Total emails sent to segment

### 2. **Growth Tracking**
- Line chart showing segment membership over time
- Historical data for 7 days, 30 days, 90 days, or 1 year
- Track how segments grow or shrink

### 3. **Most Used Segments**
- Bar chart showing top performing segments
- Ranked by user count and usage frequency
- Compare segment sizes at a glance

### 4. **Campaign Performance**
- Pie chart showing email engagement breakdown
- Opened vs clicked vs unopened emails
- Visual representation of segment engagement

### 5. **A/B Test Results**
- Display completed A/B tests for selected segment
- Compare variant A vs variant B performance
- Open rates and click rates for each variant

### 6. **CSV Export**
- Download complete segment member list
- Includes: email, full name, created date, last login, total spent
- Formatted CSV ready for external analysis

## Usage

### Viewing Analytics

1. Navigate to **Admin Dashboard → Segment Analytics**
2. Select a segment from the dropdown
3. Choose time range (7d, 30d, 90d, 1y)
4. View comprehensive analytics dashboard

### Exporting Segment Data

1. Select the segment you want to export
2. Click **Export CSV** button
3. CSV file downloads automatically with segment members
4. File name format: `segment-{name}-{date}.csv`

### Understanding Metrics

**Current Size**: Total active users in the segment right now

**Open Rate**: Percentage of emails opened by segment members
- Formula: (Total Opened / Total Sent) × 100

**Click Rate**: Percentage of emails clicked by segment members
- Formula: (Total Clicked / Total Sent) × 100

**Total Sent**: Total number of emails delivered to this segment

## API Endpoints

### Get Segment Analytics
```typescript
const { data, error } = await supabase.functions.invoke('get-segment-analytics', {
  body: {
    segmentId: 'segment-uuid',
    timeRange: '30d' // '7d', '30d', '90d', '1y'
  }
});

// Response
{
  growthData: [
    { created_at: '2024-01-01', user_count: 150 },
    { created_at: '2024-01-02', user_count: 155 }
  ],
  topSegments: [
    { id: 'uuid', name: 'High Value', last_user_count: 500 }
  ],
  engagement: {
    totalSent: 1000,
    totalOpened: 450,
    totalClicked: 120,
    openRate: '45.00',
    clickRate: '12.00'
  },
  abTests: [
    {
      id: 'uuid',
      name: 'Subject Line Test',
      variant_a_opens: 230,
      variant_b_opens: 220
    }
  ],
  campaignStats: [...]
}
```

### Export Segment Users
```typescript
const { data, error } = await supabase.functions.invoke('export-segment-users', {
  body: {
    segmentId: 'segment-uuid'
  }
});

// Returns CSV file as text
```

## Database Schema

### segment_usage_history
Tracks historical segment membership for growth analysis:
```sql
- id: uuid
- segment_id: uuid (references user_segments)
- user_count: integer
- created_at: timestamp
```

## Charts & Visualizations

### 1. Growth Over Time (Line Chart)
- X-axis: Date
- Y-axis: User count
- Shows membership trends

### 2. Top Segments (Bar Chart)
- X-axis: Segment name
- Y-axis: User count
- Compare segment sizes

### 3. Campaign Performance (Pie Chart)
- Segments: Opened, Clicked, Unopened
- Shows engagement distribution

### 4. A/B Test Results (Cards)
- Side-by-side variant comparison
- Open counts for each variant
- Test status and description

## Best Practices

### 1. **Regular Monitoring**
- Check segment analytics weekly
- Track growth trends
- Identify declining segments

### 2. **Engagement Analysis**
- Compare open rates across segments
- Identify high-performing segments
- Target engaged users with campaigns

### 3. **Data Export**
- Export segments for external analysis
- Share with marketing teams
- Import into other tools

### 4. **A/B Testing**
- Review completed tests regularly
- Apply winning variants to future campaigns
- Test different segments separately

### 5. **Segment Optimization**
- Remove inactive segments
- Refine criteria based on performance
- Create sub-segments for better targeting

## Integration with Campaigns

Segment analytics integrates with:
- **Email Campaign Scheduler**: Target high-performing segments
- **A/B Testing**: Test variants on specific segments
- **Automation Rules**: Trigger campaigns based on segment membership
- **Template Analytics**: See which templates work best per segment

## Performance Considerations

- Analytics calculated in real-time
- Historical data cached for performance
- Large segments may take longer to export
- Time range affects data volume

## Troubleshooting

**No data showing**
- Ensure segment has been evaluated recently
- Check if campaigns have been sent to segment
- Verify segment has active members

**Export fails**
- Check segment size (very large segments may timeout)
- Verify admin permissions
- Ensure segment exists and has members

**Charts not loading**
- Verify time range selection
- Check if segment has historical data
- Ensure campaigns have been sent

## Future Enhancements

- Segment overlap analysis (Venn diagrams)
- Conversion tracking by segment
- Revenue attribution per segment
- Predictive analytics for segment growth
- Automated segment recommendations
