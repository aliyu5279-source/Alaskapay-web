# Automated Email Response System

## Overview
Alaska Pay now has an intelligent automated email response system that sends customized auto-reply emails based on the type of inquiry submitted through the contact form.

## Features

### 1. Inquiry Type Selection
Users can select from 6 different inquiry types:
- **General Inquiry** - For general questions
- **Technical Support** - For technical issues and bugs
- **Sales & Pricing** - For pricing and product information
- **Partnership Opportunity** - For business partnerships
- **Billing & Payments** - For billing-related questions
- **Feedback & Suggestions** - For product feedback

### 2. Customized Auto-Reply Templates

Each inquiry type triggers a unique auto-reply email with:
- **Custom subject line** relevant to the inquiry type
- **Personalized greeting** using the sender's name
- **Type-specific information** about response times and next steps
- **Helpful resources** and contact information
- **Professional formatting** with Alaska Pay branding

### 3. Email Templates

#### General Inquiry
- Response time: 24 hours
- Standard acknowledgment message

#### Technical Support
- Response time: 2-4 hours
- Includes troubleshooting resources
- Urgent support phone number
- Link to Help Center

#### Sales & Pricing
- Response time: 24 hours
- Highlights key features and benefits
- Mentions flexible pricing plans
- Emphasizes no setup fees

#### Partnership Opportunity
- Response time: 2-3 business days
- Outlines partnership benefits
- Mentions revenue sharing
- Co-marketing opportunities

#### Billing & Payments
- Response time: 24 hours
- Billing hotline number
- Links to account dashboard
- Common billing topics covered

#### Feedback & Suggestions
- Acknowledgment of feedback
- Explains feedback review process
- Encourages community engagement
- Thanks user for contribution

## Implementation

### Edge Function: `send-contact-auto-reply`
Located at: `supabase/functions/send-contact-auto-reply/index.ts`

**Endpoint:** `https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/send-contact-auto-reply`

### How It Works

1. **User submits contact form** with inquiry type selection
2. **System sends two emails:**
   - Notification to Alaska Pay team (alaskapaynotification@gmail.com) with inquiry type badge
   - Customized auto-reply to user based on inquiry type
3. **Auto-reply includes:**
   - Personalized greeting
   - Type-specific response information
   - Original message for reference
   - Company contact details with RC number

### Email Notification Format

**To Alaska Pay Team:**
```
Subject: [Inquiry Type] Subject Line
Content:
- Inquiry Type Badge (color-coded)
- Sender name and email
- Subject line
- Full message content
```

**To User (Auto-Reply):**
```
Subject: [Type-specific subject]
Content:
- Personalized greeting
- Type-specific response information
- Expected response time
- Helpful resources
- Original message copy
- Company contact information
```

## Testing

### Test the System

1. Visit the Contact page
2. Fill in the form with test data
3. Select an inquiry type
4. Submit the form
5. Check both:
   - alaskapaynotification@gmail.com (notification)
   - Your email (auto-reply)

### Expected Results

- ✅ Notification email received by Alaska Pay team
- ✅ Auto-reply email received by user
- ✅ Auto-reply content matches inquiry type
- ✅ All contact information included
- ✅ Professional formatting maintained

## Configuration

### SendGrid Setup
The system uses SendGrid API for email delivery.

**Required Environment Variable:**
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

### From Address
All emails are sent from:
```
noreply@alaskapay.com
```

### Reply-To Configuration
User emails are set as reply-to address for easy responses.

## Benefits

1. **Immediate Acknowledgment** - Users receive instant confirmation
2. **Set Expectations** - Clear response time information
3. **Reduced Support Load** - Self-service resources provided
4. **Professional Image** - Consistent, branded communication
5. **Better Routing** - Inquiry types help team prioritize
6. **User Satisfaction** - Personalized, helpful responses

## Maintenance

### Adding New Inquiry Types

1. Update `ContactPage.tsx` Select options
2. Add new template in `getAutoReplyTemplate()` function
3. Update `inquiryLabels` mapping
4. Test new template thoroughly

### Modifying Templates

Edit the `getAutoReplyTemplate()` function in:
`supabase/functions/send-contact-auto-reply/index.ts`

### Response Time Updates

Update the response time information in each template as needed to match actual team capacity.

## Future Enhancements

- [ ] Track inquiry types in database
- [ ] Analytics dashboard for inquiry patterns
- [ ] A/B testing for template effectiveness
- [ ] Multi-language support
- [ ] Automated follow-up emails
- [ ] Integration with CRM system
- [ ] Priority routing based on inquiry type
- [ ] Template versioning and testing

## Support

For issues with the automated email system:
- Check SendGrid API key configuration
- Verify edge function deployment
- Review Supabase logs for errors
- Test with different inquiry types
- Ensure email addresses are valid

## Company Information

All auto-reply emails include:
- Company name: Alaska Pay
- RC Number: 7351158
- Address: 100 Suleiman Barau Road, Opposite FIRS, Suleja, Niger State, Nigeria
- Phone: +234 901 576 5610
- Email: alaskapaynotification@gmail.com
