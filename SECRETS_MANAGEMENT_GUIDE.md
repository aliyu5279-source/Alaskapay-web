# Environment Secrets Management System

## Overview
Secure admin panel for managing API keys, tokens, and environment variables with encryption, validation, and audit logging.

## Features

### 1. Secure Storage
- All secrets encrypted before storage (Base64 in demo, use proper encryption in production)
- Database table: `environment_secrets`
- Row-level security enabled (admin only access)

### 2. Secret Categories
- **Deployment**: Netlify, Vercel tokens
- **Database**: Supabase URLs and keys
- **Payment**: Stripe, Paystack keys
- **Email**: SendGrid API keys
- **SMS**: Twilio credentials
- **Other**: Custom secrets

### 3. Credential Validation
Test credentials before saving:
- Netlify tokens: Validates against Netlify API
- Supabase URLs: Checks endpoint reachability
- Supabase keys: Validates authentication
- Stripe keys: Tests API connection
- SendGrid keys: Verifies account access

### 4. Audit Logging
Every action tracked in `secrets_audit_logs`:
- Created, updated, deleted, rotated
- User who performed action
- Timestamp and metadata

### 5. Key Rotation
- Rotate secrets with validation
- Tracks last rotation date
- Warning about service updates needed

## Access

1. Login as admin
2. Navigate to Admin Panel
3. Click "Environment Secrets" (🔑 icon)

## Usage

### Add New Secret
1. Click "Add Secret"
2. Enter key name (e.g., NETLIFY_AUTH_TOKEN)
3. Select category
4. Paste secret value
5. Add description (optional)
6. Click "Test Connection" to validate
7. Click "Save Secret"

### View Secret
1. Click eye icon on secret card
2. Toggle visibility with eye/eye-off button
3. Copy to clipboard with copy button
4. View recent activity logs

### Edit Secret
1. Click edit icon
2. Update description or category
3. Toggle active/inactive status
4. Save changes

### Rotate Secret
1. Click rotate icon
2. Enter new secret value
3. Test new value
4. Confirm rotation
5. Update all services using this secret

### Delete Secret
1. Click trash icon
2. Confirm deletion
3. Secret and audit logs removed

## Database Schema

```sql
-- Secrets table
CREATE TABLE environment_secrets (
  id UUID PRIMARY KEY,
  key_name TEXT UNIQUE NOT NULL,
  encrypted_value TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_rotated_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE secrets_audit_logs (
  id UUID PRIMARY KEY,
  secret_id UUID REFERENCES environment_secrets(id),
  key_name TEXT NOT NULL,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Security Best Practices

1. **Encryption**: Replace Base64 with AES-256 encryption in production
2. **Access Control**: Only admin users can access secrets
3. **Audit Trail**: All actions logged with user and timestamp
4. **Validation**: Test credentials before saving
5. **Rotation**: Regularly rotate sensitive keys
6. **Backup**: Keep secure backups of critical secrets

## Files Created

- `src/services/secretsService.ts` - Secret management service
- `src/lib/credentialValidators.ts` - Credential validation functions
- `src/components/admin/SecretsManagementTab.tsx` - Main UI
- `src/components/admin/AddSecretModal.tsx` - Add secret modal
- `src/components/admin/EditSecretModal.tsx` - Edit secret modal
- `src/components/admin/ViewSecretModal.tsx` - View secret modal
- `src/components/admin/RotateSecretModal.tsx` - Rotate secret modal

## Integration

Secrets management is integrated into AdminDashboard:
- Menu item: "Environment Secrets" (🔑)
- Tab ID: `secrets-management`
- Access: Admin Panel → Environment Secrets

## Common Secrets to Add

1. **NETLIFY_AUTH_TOKEN** - For automatic deployment
2. **NETLIFY_SITE_ID** - Your site identifier
3. **SUPABASE_URL** - Database URL
4. **SUPABASE_ANON_KEY** - Public API key
5. **STRIPE_SECRET_KEY** - Payment processing
6. **SENDGRID_API_KEY** - Email delivery
7. **TWILIO_AUTH_TOKEN** - SMS notifications
8. **PAYSTACK_SECRET_KEY** - Nigerian payments

## Next Steps

1. Add secrets through the admin panel
2. Test each credential before saving
3. Set up regular rotation schedule
4. Monitor audit logs for unauthorized access
5. Implement proper encryption (replace Base64)
6. Add backup and recovery procedures
