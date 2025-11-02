# Profiles Table Setup Complete

## Overview
The profiles table has been successfully created with all required columns, indexes, RLS policies, and triggers.

## Table Structure

### Columns
- `id` (UUID, PRIMARY KEY) - References auth.users(id), cascades on delete
- `email` (TEXT, UNIQUE, NOT NULL) - User's email address
- `full_name` (TEXT) - User's full name
- `phone_number` (TEXT) - User's phone number
- `role` (user_role ENUM, DEFAULT 'user') - User role: 'user', 'admin', or 'super_admin'
- `kyc_status` (kyc_status_enum, DEFAULT 'pending') - KYC verification status
- `avatar_url` (TEXT) - URL to user's avatar image
- `created_at` (TIMESTAMPTZ, DEFAULT NOW()) - Profile creation timestamp
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW()) - Last update timestamp

## Indexes (Performance Optimized)
- `idx_profiles_email` - Fast email lookups
- `idx_profiles_role` - Fast role-based queries
- `idx_profiles_kyc_status` - Fast KYC status filtering
- `idx_profiles_phone_number` - Fast phone number lookups
- `idx_profiles_created_at` - Fast date-based sorting (DESC)

## Row Level Security (RLS) Policies

### SELECT Policies
1. **Users can view their own profile** - Users can read their own data
2. **Admins can view all profiles** - Admin and super_admin can view all users

### UPDATE Policies
1. **Users can update their own profile** - Users can modify their own data
2. **Admins can update all profiles** - Admin and super_admin can modify any profile

### INSERT Policies
1. **Enable insert for authenticated users only** - Only authenticated users can create profiles

## Automatic Triggers

### 1. Auto-Update Timestamp
- **Trigger**: `set_updated_at`
- **Function**: `handle_updated_at()`
- **Action**: Automatically updates `updated_at` field on every profile update

### 2. Auto-Create Profile on Signup
- **Trigger**: `on_auth_user_created`
- **Function**: `handle_new_user()`
- **Action**: Automatically creates a profile when a new user signs up
- **Default Values**: role='user', kyc_status='pending'

## Helper Functions

### Promote User to Admin
```sql
SELECT promote_to_admin('user@example.com');
```
This function allows promoting a user to admin role by email address.

## How to Make a User Admin

### Option 1: Using SQL (Recommended)
Run this query in Supabase SQL Editor:
```sql
SELECT promote_to_admin('your-email@example.com');
```

### Option 2: Direct Update
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Option 3: Make First User Super Admin
```sql
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'your-email@example.com';
```

## Testing the Setup

### 1. Check if table exists
```sql
SELECT * FROM profiles LIMIT 5;
```

### 2. Verify indexes
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles';
```

### 3. Check RLS policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### 4. Test auto-creation (signup a new user and check)
```sql
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;
```

## Migration File
The complete migration is saved in:
`supabase/migrations/20250201_complete_profiles_setup.sql`

## Next Steps
1. Sign up a new user to test auto-profile creation
2. Promote your account to admin using the helper function
3. Access the admin panel at `/admin`
4. The admin panel will now work correctly with proper role checking
