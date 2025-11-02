# Phone Number Verification System

## Overview
AlaskaPay now uses phone numbers as wallet account identifiers with SMS-based verification to ensure phone numbers are valid and owned by the user.

## Features Implemented

### 1. **Signup Phone Verification**
- Two-step signup process:
  1. User enters name, email, and password
  2. User verifies phone number via SMS OTP
- 6-digit OTP sent via Twilio/Africa's Talking
- OTP valid for 10 minutes
- Resend functionality with 60-second cooldown
- Phone stored as verified in user profile

### 2. **Phone Number Change Flow**
- Users can change their phone number from profile settings
- Re-verification required for new phone numbers
- Same OTP verification process
- Old phone replaced only after successful verification
- Verification badge displayed for verified phones

### 3. **Components Created**

#### `PhoneVerificationStep.tsx`
- Reusable phone verification component
- Handles OTP sending and verification
- Nigerian phone number formatting (+234)
- Countdown timer for resend
- Visual feedback with icons

#### `ChangePhoneNumberForm.tsx`
- Dedicated form for changing phone numbers
- Shows current phone number
- Uses PhoneVerificationStep for new phone
- Updates profile after verification

### 4. **Edge Functions**

#### `send-phone-otp`
- Generates 6-digit OTP
- Stores in `otp_codes` table with expiry
- Sends SMS via Twilio
- Purpose-based OTP (signup, change, etc.)

#### `verify-phone-otp`
- Validates OTP against database
- Checks expiry and usage
- Marks OTP as verified
- Returns validation result

### 5. **Database Schema**

```sql
-- otp_codes table (already exists)
- phone: Text (phone number)
- code: Text (6-digit OTP)
- purpose: Text (verification type)
- expires_at: Timestamp
- verified: Boolean
- verified_at: Timestamp

-- profiles table (updated)
- phone: Text (wallet account number)
- phone_verified: Boolean (verification status)
```

## User Flow

### Signup Flow
1. User fills in name, email, password
2. Clicks "Continue"
3. Enters phone number
4. Receives SMS with OTP
5. Enters 6-digit code
6. Account created with verified phone

### Phone Change Flow
1. User goes to Profile → Phone section
2. Clicks "Change Phone Number"
3. Enters new phone number
4. Receives SMS with OTP
5. Enters verification code
6. Phone updated and marked as verified

## Phone Number Format
- Accepts: 08012345678, 2348012345678, +2348012345678
- Stores as: +2348012345678 (E.164 format)
- Displays: +234 801 234 5678 (formatted)

## Security Features
- OTP expires after 10 minutes
- One-time use codes
- Rate limiting via resend cooldown
- Purpose-specific OTPs
- Verified flag prevents reuse

## SMS Provider Setup
Uses existing Twilio integration:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

Alternative: Africa's Talking (configured in edge functions)

## UI/UX Features
- Clear step indicators
- Real-time validation
- Countdown timer for resend
- Success/error feedback
- Verification badge in profile
- Copy-to-clipboard for phone number

## Testing
1. Test signup with phone verification
2. Test invalid OTP handling
3. Test OTP expiry (10 minutes)
4. Test resend functionality
5. Test phone change flow
6. Test phone format validation

## Future Enhancements
- [ ] SMS delivery status tracking
- [ ] Multiple phone number support
- [ ] International phone numbers
- [ ] Voice call OTP option
- [ ] SMS cost monitoring
- [ ] Fraud detection for OTP abuse
