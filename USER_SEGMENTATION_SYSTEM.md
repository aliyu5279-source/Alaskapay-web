# Advanced User Segmentation System

## Overview
Alaska Pay now includes a comprehensive user segmentation system that allows admins to create dynamic user segments based on multiple criteria and use them in email campaigns.

## Features

### 1. Visual Segment Builder
- Create segments with multiple conditions
- AND/OR logic support
- Real-time user count updates
- Segment preview functionality

### 2. Segment Criteria
- **Registration Date**: Filter by signup date ranges
- **Activity Level**: Active vs inactive users
- **Email Verification**: Verified vs unverified
- **Custom Filters**: Extensible condition system

### 3. Campaign Integration
- Select saved segments in campaign creator
- View user count for each segment
- Combine segments with additional filters
- Track segment usage in campaigns

## Database Schema

### user_segments Table
```sql
- id: UUID (primary key)
- name: VARCHAR(255)
- description: TEXT
- conditions: JSONB (segment query rules)
- created_by: UUID (references auth.users)
- user_count: INTEGER
- is_active: BOOLEAN
- created_at, updated_at, last_calculated_at: TIMESTAMPTZ
```

### segment_usage_history Table
```sql
- id: UUID (primary key)
- segment_id: UUID (references user_segments)
- campaign_id: UUID (references email_campaigns)
- user_count: INTEGER
- used_at: TIMESTAMPTZ
```

## Edge Functions

### manage-segments
Handles CRUD operations for segments:
- `list`: Get all active segments
- `create`: Create new segment
- `update`: Update segment details
- `delete`: Soft delete segment

### evaluate-segment
Evaluates segment conditions and returns matching users:
- Applies filters based on segment conditions
- Returns preview of matching users
- Updates segment user count
- Supports pagination

## Usage

### Creating a Segment
1. Navigate to Admin Dashboard → User Segments
2. Click "Create Segment"
3. Enter segment name and description
4. Add conditions using the visual builder
5. Select AND/OR logic
6. Save segment

### Using Segments in Campaigns
1. Go to Email Campaigns → Create Campaign
2. In Recipients section, select a saved segment
3. Optionally add additional filters
4. View total user count
5. Schedule and send campaign

## Condition Examples

```json
{
  "logic": "AND",
  "rules": [
    {
      "field": "registration_date",
      "operator": "last_days",
      "value": "30"
    },
    {
      "field": "activity_level",
      "operator": "equals",
      "value": "active"
    }
  ]
}
```

## Admin Interface

Access via: Admin Dashboard → User Segments (👥 icon)

Features:
- List all segments with user counts
- Preview segment members
- Refresh segment calculations
- Delete segments
- View segment usage history
