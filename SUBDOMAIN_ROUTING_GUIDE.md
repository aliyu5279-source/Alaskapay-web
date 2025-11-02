# Subdomain Routing Configuration Guide

Complete guide for routing admin.alaskapay.ng and api.alaskapay.ng with automatic SSL.

## Architecture Overview

```
alaskapay.ng              → Main web app (Netlify)
www.alaskapay.ng          → Redirects to alaskapay.ng
admin.alaskapay.ng        → Admin panel (Netlify with /admin route)
api.alaskapay.ng          → API proxy (Supabase backend)
```

## Netlify Subdomain Setup

### Method 1: Netlify Dashboard (Recommended)

1. **Add Primary Domain**
   ```
   Site Settings → Domain Management → Add custom domain
   Domain: alaskapay.ng
   ```

2. **Add Admin Subdomain**
   ```
   Domain Management → Add custom domain
   Domain: admin.alaskapay.ng
   ```

3. **Add API Subdomain**
   ```
   Domain Management → Add custom domain
   Domain: api.alaskapay.ng
   ```

4. **Configure DNS** (see DNS section below)

5. **SSL Auto-Provisions** (5-60 minutes)

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link site
netlify link

# Add domains
netlify domains:add alaskapay.ng
netlify domains:add admin.alaskapay.ng
netlify domains:add api.alaskapay.ng

# Check status
netlify domains:list
```

## DNS Configuration

### Add to Your DNS Provider

```
# Main domain
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600

# WWW subdomain
Type: CNAME
Name: www
Value: alaskapay.netlify.app
TTL: 3600

# Admin subdomain
Type: CNAME
Name: admin
Value: alaskapay.netlify.app
TTL: 3600

# API subdomain (points to Supabase)
Type: CNAME
Name: api
Value: your-project-ref.supabase.co
TTL: 3600
```

## Routing Configuration

### Create _redirects File

Create `public/_redirects`:

```
# Admin panel routing
https://admin.alaskapay.ng/*  /admin/:splat  200
http://admin.alaskapay.ng/*   https://admin.alaskapay.ng/:splat  301!

# API proxy to Supabase
https://api.alaskapay.ng/*    https://your-project.supabase.co/rest/v1/:splat  200
http://api.alaskapay.ng/*     https://api.alaskapay.ng/:splat  301!

# WWW redirect
https://www.alaskapay.ng/*    https://alaskapay.ng/:splat  301!

# HTTP to HTTPS
http://alaskapay.ng/*         https://alaskapay.ng/:splat  301!

# SPA routing (must be last)
/*  /index.html  200
```

### Update netlify.toml

```toml
[[redirects]]
  from = "https://admin.alaskapay.ng/*"
  to = "/admin/:splat"
  status = 200
  force = false

[[redirects]]
  from = "https://api.alaskapay.ng/*"
  to = "https://your-project.supabase.co/rest/v1/:splat"
  status = 200
  force = false
  headers = {X-From = "Netlify"}

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## React Router Configuration

### Update App.tsx

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main app routes */}
        <Route path="/" element={<Home />} />
        
        {/* Admin routes - accessible via admin.alaskapay.ng */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

## API Proxy Configuration

### Supabase Custom Domain

1. **Login to Supabase Dashboard**
2. **Project Settings → API**
3. **Custom Domain** (Pro plan required)
4. **Add**: api.alaskapay.ng
5. **Verify DNS**
6. **SSL Auto-Provisions**

### Alternative: Netlify Proxy

If not using Supabase custom domain:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-project.supabase.co/rest/v1/:splat"
  status = 200
  force = true
  headers = {apikey = "your-anon-key"}
```

## SSL Certificate Management

### Automatic SSL (Let's Encrypt)

Netlify automatically provisions SSL for:
- ✅ alaskapay.ng
- ✅ www.alaskapay.ng
- ✅ admin.alaskapay.ng
- ✅ api.alaskapay.ng

**Timeline**:
- DNS configured: 0 minutes
- DNS propagated: 5-60 minutes
- SSL issued: 5-15 minutes after DNS
- Total: 10-75 minutes

### Force HTTPS

Enable in Netlify:
```
Site Settings → Domain Management → HTTPS
✅ Force HTTPS
✅ Enable HSTS
```

### Certificate Renewal

- **Automatic**: Yes
- **Frequency**: Every 60 days
- **Notification**: Email 30 days before expiry
- **Downtime**: None

## Testing Subdomains

### Test Main Domain

```bash
curl -I https://alaskapay.ng
# Should return 200 OK with SSL

curl -I http://alaskapay.ng
# Should redirect to https://
```

### Test Admin Subdomain

```bash
curl -I https://admin.alaskapay.ng
# Should return 200 OK

curl https://admin.alaskapay.ng
# Should show admin panel
```

### Test API Subdomain

```bash
curl -I https://api.alaskapay.ng/health
# Should return 200 OK

curl https://api.alaskapay.ng/rest/v1/users
# Should return API response
```

### Test Redirects

```bash
# WWW should redirect
curl -I https://www.alaskapay.ng
# Should 301 to https://alaskapay.ng

# HTTP should redirect
curl -I http://alaskapay.ng
# Should 301 to https://alaskapay.ng
```

## Environment Variables

### Update for Subdomains

```bash
# .env.production
VITE_APP_URL=https://alaskapay.ng
VITE_ADMIN_URL=https://admin.alaskapay.ng
VITE_API_URL=https://api.alaskapay.ng
VITE_SUPABASE_URL=https://api.alaskapay.ng
```

### Netlify Environment Variables

```
Site Settings → Environment Variables
VITE_APP_URL = https://alaskapay.ng
VITE_ADMIN_URL = https://admin.alaskapay.ng
VITE_API_URL = https://api.alaskapay.ng
```

## Troubleshooting

### Admin Subdomain Not Working

**Check**:
1. DNS CNAME points to alaskapay.netlify.app
2. _redirects file includes admin routing
3. React Router has /admin/* route
4. Clear browser cache

### API Subdomain 404

**Check**:
1. Supabase project reference correct
2. DNS CNAME points to Supabase
3. API key configured
4. CORS settings allow domain

### SSL Not Provisioning

**Check**:
1. DNS records correct
2. Wait 24 hours for propagation
3. Remove CAA records if present
4. Contact Netlify support

## Security Headers

Add to netlify.toml:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000"
    Content-Security-Policy = "default-src 'self'"
```

## Monitoring

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Monitor:
- https://alaskapay.ng
- https://admin.alaskapay.ng
- https://api.alaskapay.ng/health

### SSL Monitoring

- Certificate expiry alerts
- SSL Labs score monitoring
- Mixed content detection

## Checklist

- [ ] DNS records added for all subdomains
- [ ] Netlify domains configured
- [ ] _redirects file created
- [ ] netlify.toml updated
- [ ] React Router configured
- [ ] Environment variables set
- [ ] SSL certificates active
- [ ] HTTPS redirect working
- [ ] Admin panel accessible
- [ ] API proxy working
- [ ] All tests passing
- [ ] Monitoring enabled

## Support

**Subdomain Issues**: domains@alaskapay.ng
**SSL Problems**: ssl@alaskapay.ng
**API Routing**: api-support@alaskapay.ng
