# Subscription Analytics Dashboard

## Overview
Comprehensive analytics dashboard for subscription management with MRR tracking, churn analysis, revenue forecasting, cohort analysis, and exportable reports.

## Features Implemented

### 1. Key Metrics Dashboard
- **MRR (Monthly Recurring Revenue)**: Real-time tracking with growth percentage
- **Active Subscriptions**: Current subscriber count with trend indicators
- **Churn Rate**: Monthly churn percentage with improvement tracking
- **Average CLV**: Customer Lifetime Value calculations

### 2. MRR Trends Chart
- Total MRR over time
- New MRR from new subscriptions
- Expansion MRR from upgrades
- Churned MRR from cancellations
- Interactive line chart with tooltips

### 3. Churn Rate Analysis
- Total churn rate tracking
- Voluntary churn (customer-initiated)
- Involuntary churn (payment failures)
- Stacked area chart visualization
- Month-over-month comparison

### 4. Plan Distribution Charts
- Subscriber count by plan (pie chart)
- Revenue contribution by plan (pie chart)
- Side-by-side comparison
- Color-coded segments

### 5. Revenue Forecasting
- 3-month revenue projection
- Confidence intervals (high/low)
- Historical vs. forecast comparison
- Shaded confidence bands
- Trend-based predictions

### 6. Cohort Analysis Table
- Monthly cohort retention rates
- Color-coded retention percentages
- 6-month retention tracking
- Visual heat map styling

### 7. Export Functionality
- CSV export for spreadsheet analysis
- PDF reports for presentations
- Excel format with charts
- Scheduled report delivery

## Components

### SubscriptionAnalyticsDashboard
Main dashboard component with tabbed interface:
```typescript
<SubscriptionAnalyticsDashboard />
```

### Individual Chart Components
- `MRRTrendChart`: Line chart for MRR trends
- `ChurnRateChart`: Area chart for churn analysis
- `PlanDistributionChart`: Pie charts for plan distribution
- `RevenueForecastChart`: Composed chart with forecast
- `CohortAnalysisTable`: Heat map table for cohorts

## Usage

### In Admin Panel
```typescript
import SubscriptionManagementTab from './admin/SubscriptionManagementTab';

// Tab includes both overview and analytics
<SubscriptionManagementTab />
```

### Custom Hook
```typescript
import { useSubscriptionAnalytics } from '@/hooks/useSubscriptionAnalytics';

const { analytics, loading, error, refetch, exportAnalytics } = useSubscriptionAnalytics('30d');

// Export reports
await exportAnalytics('csv');
await exportAnalytics('pdf');
await exportAnalytics('excel');
```

## Database Functions

### calculate_subscription_analytics
SQL function that calculates:
- Current MRR
- Active subscription count
- Average churn rate
- Customer lifetime value

```sql
SELECT calculate_subscription_analytics('30d', 'all');
```

### Views
- `subscription_mrr`: MRR calculations by month
- `subscription_churn_rate`: Churn rate calculations

## Edge Functions

### get-subscription-analytics
Fetches comprehensive analytics data:
```typescript
const { data } = await supabase.functions.invoke('get-subscription-analytics', {
  body: { timeRange: '30d', metrics: 'all' }
});
```

## Time Range Options
- `7d`: Last 7 days
- `30d`: Last 30 days (default)
- `90d`: Last 90 days
- `12m`: Last 12 months
- `all`: All time

## Metrics Calculated

### MRR Components
- **New MRR**: Revenue from new subscriptions
- **Expansion MRR**: Revenue from upgrades
- **Contraction MRR**: Revenue lost from downgrades
- **Churned MRR**: Revenue lost from cancellations
- **Net MRR**: Total monthly recurring revenue

### Churn Metrics
- **Gross Churn**: Total customers lost
- **Revenue Churn**: Total revenue lost
- **Net Churn**: Churn minus expansion
- **Voluntary Churn**: Customer-initiated cancellations
- **Involuntary Churn**: Payment failure cancellations

### Growth Metrics
- **MRR Growth Rate**: Month-over-month MRR growth
- **Customer Growth Rate**: New customers vs. churned
- **ARPU**: Average Revenue Per User
- **LTV**: Customer Lifetime Value

## Export Formats

### CSV Export
- Raw data for analysis
- Compatible with Excel/Google Sheets
- Includes all metrics and time series data

### PDF Reports
- Executive summary format
- Charts and graphs included
- Professional formatting
- Shareable with stakeholders

### Excel Export
- Multiple worksheets
- Embedded charts
- Formatted tables
- Pivot table ready

## Real-time Updates
- Automatic refresh every 5 minutes
- Manual refresh button
- WebSocket support for live updates
- Optimistic UI updates

## Best Practices

1. **Regular Monitoring**: Check analytics daily
2. **Churn Analysis**: Investigate sudden churn spikes
3. **Cohort Tracking**: Monitor retention by cohort
4. **Forecast Review**: Update forecasts monthly
5. **Export Reports**: Share with stakeholders weekly

## Troubleshooting

### No Data Showing
- Verify subscriptions exist in database
- Check date range selection
- Ensure analytics function is running

### Incorrect Calculations
- Run database migration
- Verify subscription statuses
- Check for data inconsistencies

### Export Failures
- Check browser download permissions
- Verify edge function deployment
- Review error logs

## Future Enhancements
- Predictive churn modeling
- Customer segmentation analysis
- A/B test result tracking
- Automated anomaly detection
- Custom metric builder
