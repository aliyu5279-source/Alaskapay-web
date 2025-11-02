# KYC Verification System

## Overview
Complete Know Your Customer (KYC) verification system for Alaska Pay with document upload, facial recognition, and admin approval workflow.

## Features Implemented

### Database Tables
- `kyc_submissions` - Main KYC submission records
- `kyc_documents` - Document uploads (ID, selfie, proof of address)
- `kyc_facial_verifications` - Liveness detection results
- `kyc_verification_history` - Audit trail
- `kyc_compliance_checks` - Compliance screening logs

### Storage
- `kyc-documents` bucket - Secure private storage for KYC documents

### Edge Functions
1. **submit-kyc** - Create KYC submission with personal info
2. **upload-kyc-document** - Upload documents to secure storage
3. **verify-kyc-liveness** - Facial liveness verification

### User Components
- `KYCVerificationBadge` - Status badge (verified, pending, rejected)
- `KYCSubmissionForm` - Personal info, address, ID details form
- `KYCDocumentUpload` - Document upload interface
- `KYCLivenessCheck` - Camera-based facial verification
- `KYCVerificationFlow` - Multi-step wizard (4 steps)

### Admin Components
- `KYCReviewTab` - Admin review interface in Admin Dashboard
- View submissions by status (pending, under_review, approved, rejected)
- Review personal info, documents, and verification results
- Approve/reject with notes

## User Flow

1. **Personal Information** - Enter name, DOB, nationality, phone
2. **Address Information** - Enter full address details
3. **ID Document** - Provide ID type, number, expiry date
4. **Document Upload** - Upload ID front/back, selfie, proof of address
5. **Facial Verification** - Camera-based liveness check
6. **Submission Complete** - Wait for admin review

## Admin Workflow

1. Navigate to Admin Dashboard → KYC Verification
2. View all submissions with status badges
3. Click submission to review details
4. View personal info, address, ID details, uploaded documents
5. Add review notes
6. Approve (sets status to 'approved', level to 'full')
7. Reject (sets status to 'rejected')

## Verification Levels
- **none** - Not verified
- **basic** - Basic verification complete
- **enhanced** - Enhanced verification
- **full** - Full KYC verification (highest level)

## Status Types
- **pending** - Initial submission
- **under_review** - After liveness check passes
- **approved** - Admin approved
- **rejected** - Admin rejected
- **resubmit_required** - Needs resubmission

## Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only view/edit their own submissions
- Documents stored in private bucket
- Admin-only approval workflow
- Complete audit trail in verification_history

## Compliance
- Document expiry validation
- Liveness detection scoring
- Risk scoring (0-100)
- Compliance flags tracking
- Sanctions/PEP screening ready (placeholder for integration)

## Integration Points
- Display `KYCVerificationBadge` anywhere user status is shown
- Check verification status before high-value transactions
- Require 'approved' status for premium features
- Email notifications on status changes (integrate with existing email system)

## Next Steps
1. Integrate third-party KYC provider (Onfido, Jumio, AWS Rekognition)
2. Add automated document OCR extraction
3. Implement sanctions/PEP screening
4. Add email notifications for status changes
5. Create user-facing KYC status page in Dashboard
6. Add verification expiry/renewal workflow
