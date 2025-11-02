# Alaska Pay Email Edge Functions

Due to deployment issues, manually create these edge functions in Supabase Dashboard:

## 1. send-welcome-email
```typescript
export const corsHeaders = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});try{const{email,name}=await req.json();const key=Deno.env.get("SENDGRID_API_KEY");const html=`<!DOCTYPE html><html><body style="font-family:Arial;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:40px;text-align:center"><h1>Welcome to Alaska Pay!</h1></div><div style="padding:30px"><h2>Hi ${name}!</h2><p>Thank you for joining Alaska Pay.</p><a href="https://alaskapay.com/dashboard" style="background:#667eea;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;display:inline-block">Get Started</a></div></body></html>`;const res=await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:[{email}],subject:"Welcome to Alaska Pay!"}],from:{email:"noreply@alaskapay.com",name:"Alaska Pay"},content:[{type:"text/html",value:html}]})});if(!res.ok)throw new Error(await res.text());return new Response(JSON.stringify({success:true}),{headers:{"Content-Type":"application/json",...corsHeaders}});}catch(error){return new Response(JSON.stringify({error:error.message}),{status:500,headers:{"Content-Type":"application/json",...corsHeaders}});}});
```

## 2-5. Create similar functions for:
- send-password-reset
- send-payment-confirmation  
- send-transaction-receipt
- send-activity-alert

See src/lib/emailTemplates.ts for HTML templates.
