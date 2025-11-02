# 🚀 Release Management System

## Overview
Automated release management with version bumping, changelog generation, staged rollouts, and automatic rollback capabilities for production deployments.

## Features

### 1. **Version Management**
- Semantic versioning (MAJOR.MINOR.PATCH)
- Automatic version bumping
- Build number tracking
- Platform-specific releases (iOS, Android, Web)

### 2. **Changelog Generation**
- Automatic generation from git commits
- Categorized by type (features, fixes, docs)
- Commit hash references
- Author attribution

### 3. **Staged Rollout**
- **Stage 1**: 10% of users
- **Stage 2**: 50% of users  
- **Stage 3**: 100% of users (full release)
- Configurable stage percentages
- Automatic progression between stages

### 4. **Crash Monitoring**
- Real-time crash rate tracking
- Configurable crash thresholds (default: 5%)
- Automatic rollback on high crash rates
- Per-stage crash monitoring

### 5. **Approval Workflows**
- Multi-approver support
- Comments and feedback
- Approval history tracking
- Reject with reason

## Database Schema

### `releases`
```sql
- id: UUID (primary key)
- version: VARCHAR(20) - e.g., "1.2.3"
- build_number: INTEGER
- platform: VARCHAR(20) - ios/android/web
- status: VARCHAR(20) - draft/pending_approval/approved/deploying/staged_rollout/completed/rolled_back
- rollout_percentage: INTEGER (0-100)
- changelog: TEXT
- crash_rate: DECIMAL(5,2)
- crash_threshold: DECIMAL(5,2)
- created_by: UUID
- approved_by: UUID
- approved_at: TIMESTAMPTZ
```

### `release_approvals`
```sql
- id: UUID
- release_id: UUID
- approver_id: UUID
- status: VARCHAR(20) - pending/approved/rejected
- comments: TEXT
```

### `release_rollout_stages`
```sql
- id: UUID
- release_id: UUID
- stage_number: INTEGER
- percentage: INTEGER
- status: VARCHAR(20)
- crash_rate: DECIMAL(5,2)
- user_count: INTEGER
```

## Usage

### Creating a Release

#### Via GitHub Actions
```bash
# Trigger workflow manually
gh workflow run release.yml \
  -f version=1.2.3 \
  -f platform=all \
  -f skip_approval=false
```

#### Via Admin Dashboard
1. Navigate to Admin Panel → Release Management
2. Click "Create Release"
3. Fill in version, build number, platform
4. Add changelog
5. Set crash threshold
6. Submit for approval

### Approval Process
1. Release created with status "pending_approval"
2. Approvers review changelog and details
3. Approve or reject with comments
4. Approved releases move to "approved" status
5. Ready for deployment

### Staged Rollout
```typescript
// Automatic progression
Stage 1 (10%) → Monitor 5 minutes → Stage 2 (50%) → Monitor 5 minutes → Stage 3 (100%)

// Crash monitoring at each stage
if (crashRate > threshold) {
  automaticRollback();
}
```

### Monitoring Release Health
```typescript
// Edge function monitors crash rates
const { data } = await supabase.functions.invoke('monitor-release-health', {
  body: { releaseId: 'xxx' }
});

if (data.rolledBack) {
  console.log('Release rolled back due to high crash rate');
}
```

## Scripts

### Generate Release Notes
```bash
chmod +x scripts/generate-release-notes.sh
./scripts/generate-release-notes.sh 1.2.3
```

Output:
```markdown
# Release Notes - v1.2.3

## 🚀 Features
- Add user authentication (abc123)

## 🐛 Bug Fixes
- Fix payment processing (def456)

## 📚 Documentation
- Update API docs (ghi789)
```

## Edge Functions

### `create-release`
Creates new release with rollout stages
```typescript
const { data } = await supabase.functions.invoke('create-release', {
  body: {
    version: '1.2.3',
    platform: 'ios',
    changelog: '...',
    buildNumber: 123
  }
});
```

### `monitor-release-health`
Monitors crash rates and triggers rollback
```typescript
const { data } = await supabase.functions.invoke('monitor-release-health', {
  body: { releaseId: 'xxx' }
});
```

## Admin Dashboard

### Release Management Tab
- View all releases
- Filter by status/platform
- Create new releases
- Monitor active rollouts
- View crash rates
- Approve/reject releases

### Release Cards
- Version and build number
- Platform badge
- Status indicator
- Rollout progress bar
- Crash rate metrics
- Rollback reason (if applicable)

## Automatic Rollback

### Triggers
- Crash rate exceeds threshold
- Manual rollback by admin
- Failed deployment

### Process
1. Detect high crash rate
2. Update release status to "rolled_back"
3. Record rollback reason
4. Notify admins
5. Revert to previous stable version

## Best Practices

1. **Always test in beta first**
2. **Set appropriate crash thresholds** (5% recommended)
3. **Monitor each rollout stage** before progressing
4. **Write detailed changelogs** for transparency
5. **Require approvals** for production releases
6. **Keep rollback plan ready**

## Integration with CI/CD

### GitHub Actions Workflow
```yaml
- Generate changelog from commits
- Bump version in package.json
- Create git tag
- Create release in database
- Wait for approval
- Deploy in stages (10% → 50% → 100%)
- Monitor crash rates
- Auto-rollback if needed
```

## Monitoring & Alerts

- Real-time crash rate tracking
- Stage progression notifications
- Rollback alerts
- Approval request notifications
- Deployment status updates

## Security

- RLS policies for admin-only access
- Approval audit trail
- Release history tracking
- Rollback reason logging

## Next Steps

1. Configure crash reporting (Firebase Crashlytics)
2. Set up approval workflows
3. Test staged rollout process
4. Monitor first production release
5. Refine crash thresholds based on data
