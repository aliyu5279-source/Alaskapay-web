# Alaska Pay - Authentication Guide

## Overview
Complete Supabase authentication system with sign up, login, logout, password reset, email verification, and protected routes.

## Features Implemented

### 1. User Registration (Sign Up)
- Email and password registration
- Full name collection
- Automatic profile creation via database trigger
- Email verification (configured in Supabase)

### 2. User Login
- Email/password authentication
- Session persistence across page refreshes
- Automatic redirect after successful login

### 3. Password Reset
- Email-based password recovery
- Reset link sent to user's email
- Secure token-based reset flow

### 4. User Profile Management
- View and edit profile information
- Update full name and phone number
- Profile data stored in `profiles` table

### 5. Protected Routes
- Dashboard, Payments, Admin, and Profile pages require authentication
- Automatic redirect to login for unauthenticated users
- Loading states during authentication check

### 6. Session Management
- Persistent sessions across page refreshes
- Automatic token refresh
- Real-time auth state updates

## Usage

### Accessing Authentication
- Click "Sign In" button in navbar
- Navigate to `#auth` hash route
- Forms include:
  - Login form
  - Sign up form
  - Password reset form

### User Flow
1. **New User**: Click "Sign In" → "Sign up" → Fill form → Verify email → Login
2. **Existing User**: Click "Sign In" → Enter credentials → Access dashboard
3. **Forgot Password**: Click "Sign In" → "Forgot password?" → Enter email → Check inbox

### Protected Pages
- `/admin` - Admin dashboard (requires authentication)
- `#payments` - Payment methods page (requires authentication)
- `#profile` - User profile settings (requires authentication)
- `#dashboard` - User dashboard (requires authentication)

## Database Schema

### Profiles Table
```sql
- id (UUID, references auth.users)
- email (TEXT)
- full_name (TEXT)
- avatar_url (TEXT)
- phone (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Row Level Security (RLS)
- Users can only view/edit their own profile
- Automatic profile creation on user signup

## Configuration in Supabase

### Email Settings (Optional)
1. Go to Authentication → Email Templates
2. Customize confirmation and password reset emails
3. Set redirect URLs for email actions

### Email Verification
- Enable in Authentication → Settings
- Users must verify email before full access (optional)

## Testing
1. Sign up with a new email
2. Check email for verification link
3. Login with credentials
4. Access protected routes
5. Test password reset flow
6. Update profile information
7. Sign out and verify session cleared
