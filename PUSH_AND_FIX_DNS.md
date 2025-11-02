# 🚀 PUSH CODE & FIX DNS - COMPLETE GUIDE

## ✅ STEP 1: PUSH YOUR CODE TO GITHUB (FIXED CONFIG)

I've fixed your GitHub configuration! Now push the changes:

### **Windows Users - EASIEST WAY:**
1. Double-click: `push-to-github.bat`
2. Enter: `https://github.com/aliyu5279-source/Alaska-pay.git`
3. Done! ✅

### **Mac/Linux Users:**
```bash
bash push-to-github.sh
```

### **Manual Method:**
```bash
git add .
git commit -m "Fix DNS configuration for alaskapay.ng"
git push origin main
```

---

## ✅ STEP 2: FIX DNS AT YOUR DOMAIN REGISTRAR

### **Login to Your Domain Registrar:**
- **Whogohost**: https://whogohost.com/members/clientarea.php
- **Qservers**: https://www.qservers.net/clients/
- **Or wherever you bought alaskapay.ng**

### **Add These DNS Records:**

#### **A Records (for alaskapay.ng):**
```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153

Type: A
Name: @ (or leave blank)
Value: 185.199.109.153

Type: A
Name: @ (or leave blank)
Value: 185.199.110.153

Type: A
Name: @ (or leave blank)
Value: 185.199.111.153
```

#### **CNAME Record (for www):**
```
Type: CNAME
Name: www
Value: aliyu5279-source.github.io
```

### **Delete These If They Exist:**
- Any A records pointing to other IPs
- Any CNAME for @ pointing elsewhere

---

## ✅ STEP 3: VERIFY DNS PROPAGATION

Wait 5-30 minutes, then check:

### **Windows Command Prompt:**
```cmd
nslookup alaskapay.ng
```

### **Mac/Linux Terminal:**
```bash
dig alaskapay.ng
```

### **Online Tools:**
- https://dnschecker.org/#A/alaskapay.ng
- https://www.whatsmydns.net/#A/alaskapay.ng

**You should see the GitHub IPs (185.199.108-111.153)**

---

## ✅ STEP 4: CONFIGURE GITHUB PAGES

1. Go to: https://github.com/aliyu5279-source/Alaska-pay/settings/pages
2. Under **Custom domain**, enter: `alaskapay.ng`
3. Click **Save**
4. Wait for DNS check (may take a few minutes)
5. Check **Enforce HTTPS** once DNS is verified

---

## 🎉 WHAT I FIXED:

✅ Created `public/CNAME` file with your domain
✅ Updated `vite.config.pages.ts` to use root path `/`
✅ Modified GitHub Actions to copy CNAME file
✅ Configured proper build for custom domain

---

## ⏱️ TIMELINE:

- **Push code**: Instant
- **GitHub build**: 2-5 minutes
- **DNS propagation**: 5-30 minutes (sometimes up to 48 hours)
- **SSL certificate**: Automatic after DNS verifies

---

## 🆘 TROUBLESHOOTING:

### **"Domain's DNS record could not be retrieved"**
- DNS records not added yet → Add them at your registrar
- DNS not propagated → Wait 30 minutes and try again

### **"Domain is improperly configured"**
- Wrong IP addresses → Use the 4 GitHub IPs above
- CNAME conflict → Remove any @ CNAME records

### **"404 Not Found"**
- Wait for deployment to complete
- Check GitHub Actions tab for build status

---

## 📞 NEED HELP?

Check deployment status:
https://github.com/aliyu5279-source/Alaska-pay/actions

Your site will be live at:
- https://alaskapay.ng (after DNS setup)
- https://www.alaskapay.ng (after DNS setup)
