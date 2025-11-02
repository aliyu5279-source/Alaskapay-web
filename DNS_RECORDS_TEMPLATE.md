# 📝 DNS Records Template for alaskapay.com

## Copy-paste these exact records into your domain registrar

---

## 🔷 For Netlify Deployment

### Record 1: Root Domain (A Record)
```
Type: A
Host/Name: @
Value/Points to: 75.2.60.5
TTL: 3600 (or Auto)
```

### Record 2: WWW Subdomain (CNAME)
```
Type: CNAME
Host/Name: www
Value/Points to: alaskapay.netlify.app
TTL: 3600 (or Auto)
```

---

## 🔶 For Vercel Deployment

### Record 1: Root Domain (A Record)
```
Type: A
Host/Name: @
Value/Points to: 76.76.21.21
TTL: 3600 (or Auto)
```

### Record 2: WWW Subdomain (CNAME)
```
Type: CNAME
Host/Name: www
Value/Points to: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

---

## 📋 Quick Copy Format

### Netlify
```
A @ 75.2.60.5 3600
CNAME www alaskapay.netlify.app 3600
```

### Vercel
```
A @ 76.76.21.21 3600
CNAME www cname.vercel-dns.com 3600
```

---

## 🎯 Domain Registrar Specific Instructions

### GoDaddy
1. Login → My Products → Domains
2. Click DNS next to alaskapay.com
3. Click "Add" for each record
4. Save all changes

### Namecheap
1. Domain List → Manage
2. Advanced DNS tab
3. Add New Record for each
4. Save all changes

### Cloudflare
1. Select alaskapay.com
2. DNS tab
3. Add record (disable proxy initially)
4. Save

### Google Domains
1. My domains → alaskapay.com
2. DNS → Custom records
3. Create new record for each
4. Save

---

## ✅ Verification Commands

```bash
# Check A record
dig alaskapay.com A +short

# Check CNAME record
dig www.alaskapay.com CNAME +short

# Check all records
dig alaskapay.com ANY

# Alternative (Windows/Mac/Linux)
nslookup alaskapay.com
nslookup www.alaskapay.com
```

---

## ⏱️ Propagation Time

- **Local ISP**: 5-30 minutes
- **Global**: 24-48 hours
- **Check status**: https://dnschecker.org

---

## 🚨 Common Mistakes to Avoid

❌ Using "alaskapay.com" instead of "@" for root
❌ Adding "http://" or "https://" in values
❌ Forgetting to save changes
❌ Not removing old conflicting records
✅ Use exactly "@" for root domain
✅ Use plain domain/IP values
✅ Save after each record
✅ Delete old A/CNAME records first
