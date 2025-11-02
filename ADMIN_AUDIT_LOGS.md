# Alaska Pay - Admin Audit Log System

## Overview
Comprehensive audit logging system that tracks all administrative actions with full details including timestamps, admin information, IP addresses, device info, and before/after values.

## Features Implemented

### 1. Database Table
- `admin_audit_logs` table with complete audit trail
- Tracks: admin user, action type, resource type, timestamps
- Stores: before/after values, IP address, device info, user agent
- Indexed for fast queries and filtering

### 2. Edge Function
- `log-admin-action` - Logs administrative actions
- Captures device information and IP address automatically
- Stores complete audit trail with metadata

### 3. Audit Logs Display
- Searchable table with real-time filtering
- Filter by action type (create/update/delete/override/role_change)
- Filter by resource type (user/role/service/transaction)
- Export to CSV functionality
- Color-coded action badges

### 4. Integration Points
Ready to integrate with:
- UsersTab - User modifications and status changes
- RolesTab - Role assignments and permission changes
- ServicesTab - Service configuration updates
- TransactionsTab - Transaction overrides and adjustments

## Usage

### Logging Admin Actions
```typescript
import { logAdminAction } from '@/lib/auditLogger';

// Log a user status change
await logAdminAction({
  actionType: 'update',
  resourceType: 'user',
  resourceId: userId,
  description: 'Changed user status from active to suspended',
  beforeValue: { status: 'active' },
  afterValue: { status: 'suspended' }
});
```

### Viewing Audit Logs
1. Navigate to Admin Dashboard
2. Click "Audit Logs" in sidebar
3. Use search and filters to find specific actions
4. Export to CSV for compliance reporting

## Action Types
- `create` - New resource created
- `update` - Resource modified
- `delete` - Resource deleted
- `override` - Manual override of automated process
- `role_change` - User role or permission changed

## Resource Types
- `user` - User account actions
- `role` - Role and permission changes
- `service` - Service configuration
- `transaction` - Transaction modifications

## Security Benefits
- Complete accountability for all admin actions
- Forensic trail for security investigations
- Compliance with audit requirements
- Detect unauthorized or suspicious admin activity
- Track who changed what and when

## CSV Export
Export includes:
- Timestamp
- Admin email
- Action type
- Resource type
- Resource ID
- Description
- IP address
