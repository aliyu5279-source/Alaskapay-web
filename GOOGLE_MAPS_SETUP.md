# Google Maps API Key Setup Guide

## Step-by-Step Instructions

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Sign In
- Use your Google account (Gmail)
- If you don't have one, create a free Google account first

### 3. Create a New Project
- Click the project dropdown at the top (says "Select a project")
- Click "NEW PROJECT" button
- Enter a project name (e.g., "AlaskaPay Website")
- Click "CREATE"
- Wait for the project to be created (takes a few seconds)

### 4. Enable Billing (Required)
- Google requires billing info but offers **$200 FREE credit per month**
- Click "Billing" in the left menu
- Click "LINK A BILLING ACCOUNT"
- Follow prompts to add a credit/debit card
- **Note**: You won't be charged unless you exceed $200/month (unlikely for most sites)

### 5. Enable Maps JavaScript API
- In the left menu, click "APIs & Services" → "Library"
- Search for "Maps JavaScript API"
- Click on it
- Click the blue "ENABLE" button

### 6. Create API Key
- Go to "APIs & Services" → "Credentials"
- Click "+ CREATE CREDENTIALS" at the top
- Select "API key"
- Your API key will be created and shown in a popup
- **COPY THIS KEY** - you'll need it!

### 7. Restrict Your API Key (Important for Security)
- In the popup, click "EDIT API KEY" or find it in the credentials list
- Under "Application restrictions":
  - Select "HTTP referrers (web sites)"
  - Click "ADD AN ITEM"
  - Add your domains:
    - `localhost:*` (for local development)
    - `yourdomain.com/*` (your production domain)
    - `*.yourdomain.com/*` (for subdomains)
- Under "API restrictions":
  - Select "Restrict key"
  - Check "Maps JavaScript API"
- Click "SAVE"

### 8. Add to Your Project

**Option A: Using Supabase Secrets (Recommended for Production)**
```bash
# In your terminal
supabase secrets set GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Option B: Using Environment Variables (For Development)**
Create a `.env.local` file in your project root:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Then restart your development server.

### 9. Update the Contact Page
The ContactUs component is already set up to use the API key from environment variables.

## Pricing Information
- **First $200/month**: FREE
- **After $200**: Pay only for what you use
- **Typical usage**: Most small-medium websites stay well under the free tier
- **Map loads**: ~$7 per 1,000 loads (after free tier)

## Troubleshooting

### "This page can't load Google Maps correctly"
- Check that billing is enabled
- Verify the API key is correct
- Make sure Maps JavaScript API is enabled
- Check that your domain is in the allowed referrers list

### API Key Not Working
- Wait 5 minutes after creating (propagation time)
- Clear browser cache
- Check browser console for specific error messages

## Alternative: Use Static Map (No API Key Required)
If you don't want to set up Google Maps, you can use a static image or link to Google Maps instead. The ContactUs component will work without the map section.

## Need Help?
- Google Maps Platform Documentation: https://developers.google.com/maps/documentation
- Google Cloud Support: https://cloud.google.com/support
