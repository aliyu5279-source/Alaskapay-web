# Email Verification Setup Guide

## Overview
Alaska Pay now requires email verification for new signups. Users must click a verification link in their welcome email before they can fully access the platform.

## Supabase Configuration

### 1. Enable Email Confirmation
In your Supabase Dashboard:
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Enable **"Confirm email"** toggle
4. Set **Site URL** to your production URL (e.g., `https://yourdomain.com`)
5. Add redirect URLs under **Redirect URLs**:
   - `http://localhost:5173/dashboard` (for development)
   - `https://yourdomain.com/dashboard` (for production)

### 2. Customize Email Templates (Optional)
In Supabase Dashboard:
1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. Customize with Alaska Pay branding
4. Use these variables:
   - `{{ .ConfirmationURL }}` - The verification link
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .Token }}` - Verification token

## Features Implemented

### 1. Email Verification Banner
- Shows at top of dashboard for unverified users
- Displays warning message with yellow styling
- Includes "Resend Verification Email" button
- Can be dismissed temporarily
- Auto-hides once email is verified

### 2. Resend Verification Email
- Button in banner to resend verification email
- Uses Supabase's built-in `resend()` function
- Shows success/error toast notifications
- Prevents spam with loading state

### 3. Signup Flow
- User signs up with email/password
- Supabase sends verification email automatically
- User sees success message to check email
- User clicks verification link in email
- Email is verified, banner disappears

## User Flow

1. **New User Signs Up**
   - Fills out signup form
   - Receives "Check your email" message
   - Gets verification email from Supabase

2. **Email Verification**
   - User clicks link in email
   - Redirected to dashboard
   - Email is now verified (`email_confirmed_at` is set)

3. **Unverified User Access**
   - Can still log in
   - Sees yellow banner at top of dashboard
   - Can click "Resend Email" if needed
   - Banner disappears after verification

## Testing

### Development Testing
1. Sign up with a real email address
2. Check your inbox for verification email
3. Click the verification link
4. Verify banner disappears

### Testing Resend Function
1. Sign up but don't verify
2. Log in to dashboard
3. See verification banner
4. Click "Resend Email"
5. Check inbox for new verification email

## Technical Details

### AuthContext Changes
- `signUp()` now includes `emailRedirectTo` option
- Redirects to dashboard after email verification
- Maintains user session after verification

### Database
- Uses Supabase's built-in `auth.users` table
- `email_confirmed_at` field tracks verification status
- No additional tables needed

### Components
- `EmailVerificationBanner.tsx` - Banner component
- `Dashboard.tsx` - Shows banner for unverified users
- `SignupForm.tsx` - Updated signup flow

## Production Checklist

- [ ] Enable email confirmation in Supabase
- [ ] Set correct Site URL in Supabase
- [ ] Add production redirect URLs
- [ ] Customize email template with branding
- [ ] Test signup flow end-to-end
- [ ] Test resend functionality
- [ ] Verify email links work correctly

## Troubleshooting

**Verification emails not sending:**
- Check Supabase email settings are enabled
- Verify SMTP configuration (if using custom SMTP)
- Check spam folder

**Redirect not working:**
- Verify redirect URL is added in Supabase settings
- Check Site URL matches your domain
- Ensure HTTPS in production

**Banner not disappearing:**
- Check `email_confirmed_at` field in database
- Verify auth state is updating
- Try refreshing the page

## Security Notes

- Email verification is handled by Supabase
- Verification tokens expire after 24 hours
- Users can still access dashboard while unverified (soft verification)
- For hard verification (block access), modify `ProtectedRoute.tsx`
