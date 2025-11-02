# Export Template Analytics System

## Overview
The Template Analytics System provides comprehensive insights into export template usage, performance, and adoption patterns. It helps administrators optimize templates and understand user behavior.

## Features

### 1. Usage Trends
- **Daily Usage Tracking**: Monitor template creation over time
- **Time Range Selection**: View data for 7, 30, or 90 days
- **Line Chart Visualization**: Clear trend visualization
- **Pattern Recognition**: Identify usage spikes and patterns

### 2. Popular Templates
- **Top 10 Ranking**: Most frequently used templates
- **Usage Count Display**: Number of times each template was applied
- **Category Breakdown**: See which categories are most popular
- **Bar Chart Visualization**: Easy comparison of template popularity

### 3. Performance Metrics
- **Success Rate Tracking**: Monitor template execution success rates
- **Failure Analysis**: Identify templates with high failure rates
- **Total Executions**: Track overall template usage
- **Visual Indicators**: Color-coded success/failure bars

### 4. Category Distribution
- **Pie Chart Visualization**: See template distribution across categories
- **Percentage Breakdown**: Understand category proportions
- **Category Labels**:
  - Daily Reports
  - Weekly Summaries
  - Monthly Analytics
  - Custom

### 5. Adoption Statistics
- **Total Templates**: Count of all templates in the system
- **Active Templates**: Templates currently in use
- **Unique Users**: Number of users creating templates
- **Average Success Rate**: Overall system performance

### 6. Optimization Recommendations
- **Low Success Rate Alerts**: Templates performing below 70%
- **Unused Template Detection**: Identify templates never used
- **Actionable Insights**: Specific recommendations for improvement
- **Warning/Info Levels**: Prioritized recommendations

## Usage

### Accessing Analytics
```typescript
// From Export Template Library
<Button onClick={() => setShowAnalytics(true)}>
  <BarChart3 className="w-4 h-4 mr-2" />
  View Analytics
</Button>
```

### API Integration
```typescript
const { data } = await supabase.functions.invoke('get-template-analytics', {
  body: { timeRange: '30d' } // '7d', '30d', or '90d'
});
```

## Analytics Data Structure

### Usage Trends
```typescript
{
  usageTrends: [
    { date: '2025-01-01', count: 5 },
    { date: '2025-01-02', count: 8 }
  ]
}
```

### Popular Templates
```typescript
{
  popularTemplates: [
    {
      id: 'template-id',
      name: 'Daily Report',
      usageCount: 45,
      category: 'daily-reports'
    }
  ]
}
```

### Performance Metrics
```typescript
{
  performanceMetrics: [
    {
      templateId: 'template-id',
      total: 100,
      success: 95,
      failed: 5,
      successRate: 95.0
    }
  ]
}
```

### Category Distribution
```typescript
{
  categoryDistribution: [
    { category: 'daily-reports', count: 15 },
    { category: 'weekly-summaries', count: 10 }
  ]
}
```

### Recommendations
```typescript
{
  recommendations: [
    {
      type: 'warning',
      template: 'Template Name',
      message: 'Low success rate (65%). Review configuration.'
    },
    {
      type: 'info',
      message: '5 templates have never been used. Consider archiving.'
    }
  ]
}
```

## Components

### TemplateAnalyticsDashboard
Main dashboard component with tabs for different analytics views.

### UsageTrendsChart
Line chart showing template usage over time.

### PopularTemplatesChart
Horizontal bar chart displaying top 10 templates.

### PerformanceMetricsChart
Stacked bar chart showing success/failure rates.

### CategoryDistributionChart
Pie chart with category breakdown and statistics.

## Best Practices

### 1. Regular Monitoring
- Check analytics weekly to identify trends
- Review recommendations for optimization opportunities
- Monitor success rates for critical templates

### 2. Template Optimization
- Address templates with success rates below 70%
- Archive unused templates to reduce clutter
- Clone and modify high-performing templates

### 3. User Adoption
- Promote popular templates to new users
- Create templates for common use cases
- Share successful templates across teams

### 4. Performance Improvement
- Investigate failure patterns
- Test templates before wide deployment
- Update templates based on usage feedback

## Metrics Interpretation

### Success Rate Thresholds
- **90%+**: Excellent - Template is reliable
- **70-89%**: Good - Minor issues may exist
- **50-69%**: Fair - Review configuration
- **Below 50%**: Poor - Immediate attention needed

### Usage Patterns
- **Increasing Trend**: Growing adoption
- **Stable Usage**: Consistent demand
- **Declining Trend**: May need updates or promotion
- **Spikes**: Investigate cause (new feature, campaign, etc.)

## Troubleshooting

### No Data Showing
- Ensure templates have been used in the selected time range
- Check database connectivity
- Verify edge function is deployed

### Inaccurate Metrics
- Confirm scheduled exports are running
- Check for data synchronization issues
- Review edge function logs for errors

### Performance Issues
- Limit time range for large datasets
- Consider data aggregation for older data
- Optimize database queries if needed

## Future Enhancements
- Real-time analytics updates
- Custom date range selection
- Export analytics data
- Template comparison tools
- User-specific analytics
- Predictive analytics for template usage