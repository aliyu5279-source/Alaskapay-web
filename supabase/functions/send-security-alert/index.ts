import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const FROM_EMAIL = 'noreply@alaskapay.com';

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: 'Alaska Pay Security' },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }
  return response;
}

function getTemplate(type: string, meta: any) {
  const base = `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb"><div style="background:white;border-radius:8px;padding:30px;box-shadow:0 2px 4px rgba(0,0,0,0.1)">`;
  const foot = `</div><div style="text-align:center;margin-top:20px;color:#6b7280;font-size:12px"><p>Automated alert from Alaska Pay</p><p>Questions? support@alaskapay.com</p></div></div>`;
  
  const t: any = {
    admin_critical_notification: {
      subject: '🚨 Critical Admin Alert - Alaska Pay',
      html: `${base}<h2 style="color:#dc2626">🚨 Critical Admin Alert</h2><p style="font-size:16px;color:#1f2937"><strong>${meta.title||'Critical Event'}</strong></p><p style="color:#4b5563">${meta.message||'A critical event requires your attention.'}</p><div style="background:#fef2f2;padding:15px;border-radius:6px;margin:20px 0;border-left:4px solid #dc2626"><p><strong>Type:</strong> ${meta.notification_type||'Unknown'}</p><p><strong>Resource:</strong> ${meta.resource_type||'N/A'} ${meta.resource_id?'(ID: '+meta.resource_id+')':''}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p>${meta.details?'<p><strong>Details:</strong> '+meta.details+'</p>':''}</div><p style="color:#dc2626;font-weight:bold">Immediate action may be required.</p><a href="https://alaskapay.com/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#dc2626;color:white;text-decoration:none;border-radius:6px">View Admin Dashboard</a>${foot}`
    },
    new_device_login: {
      subject: '🔐 New Device Login',
      html: `${base}<h2 style="color:#1f2937">🔐 New Device Login</h2><p>Login detected from new device.</p><div style="background:#f3f4f6;padding:15px;border-radius:6px;margin:20px 0"><p><strong>Device:</strong> ${meta.device||'Unknown'}</p><p><strong>Location:</strong> ${meta.location||'Unknown'}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p></div><p style="color:#dc2626;font-weight:bold">If not you, secure account immediately.</p><a href="https://alaskapay.com/profile" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#3b82f6;color:white;text-decoration:none;border-radius:6px">Review Activity</a>${foot}`
    },
    failed_login: {
      subject: '⚠️ Failed Login Attempts',
      html: `${base}<h2 style="color:#dc2626">⚠️ Failed Login Attempts</h2><p>Multiple failed logins detected.</p><div style="background:#fef2f2;padding:15px;border-radius:6px;margin:20px 0;border-left:4px solid #dc2626"><p><strong>Attempts:</strong> ${meta.attempts||'Multiple'}</p><p><strong>Location:</strong> ${meta.location||'Unknown'}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p></div><p style="color:#dc2626;font-weight:bold">Change password immediately.</p><a href="https://alaskapay.com/reset-password" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#dc2626;color:white;text-decoration:none;border-radius:6px">Change Password</a>${foot}`
    },
    large_transaction: {
      subject: '💰 Large Transaction',
      html: `${base}<h2>💰 Large Transaction</h2><p>Large transaction processed.</p><div style="background:#fef3c7;padding:15px;border-radius:6px;margin:20px 0;border-left:4px solid #f59e0b"><p><strong>Amount:</strong> $${meta.amount||'0.00'}</p><p><strong>Recipient:</strong> ${meta.recipient||'Unknown'}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p></div><p style="color:#92400e">Contact support if unauthorized.</p><a href="https://alaskapay.com/transactions" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#f59e0b;color:white;text-decoration:none;border-radius:6px">View Transaction</a>${foot}`
    },
    password_change: {
      subject: '🔒 Password Changed',
      html: `${base}<h2 style="color:#059669">🔒 Password Changed Successfully</h2><p>Your password was changed.</p><div style="background:#f0fdf4;padding:15px;border-radius:6px;margin:20px 0;border-left:4px solid #059669"><p><strong>Device:</strong> ${meta.device||'Unknown'}</p><p><strong>IP:</strong> ${meta.ipAddress||'Unknown'}</p><p><strong>Location:</strong> ${meta.location||'Unknown'}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p></div><p style="color:#dc2626;font-weight:bold">If not you, contact support immediately.</p><a href="https://alaskapay.com/profile" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:6px">Review Security</a>${foot}`
    },
    email_change_old: {
      subject: '⚠️ Email Change Request',
      html: `${base}<h2 style="color:#dc2626">⚠️ Email Change Request</h2><p>Request to change your email address.</p><div style="background:#fef2f2;padding:15px;border-radius:6px;margin:20px 0;border-left:4px solid #dc2626"><p><strong>New Email:</strong> ${meta.newEmail||'Unknown'}</p><p><strong>Device:</strong> ${meta.device||'Unknown'}</p><p><strong>IP:</strong> ${meta.ipAddress||'Unknown'}</p><p><strong>Location:</strong> ${meta.location||'Unknown'}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p></div><p style="color:#dc2626;font-weight:bold">If not you, secure account immediately.</p><a href="https://alaskapay.com/profile" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#dc2626;color:white;text-decoration:none;border-radius:6px">Secure Account</a>${foot}`
    },
    email_change_new: {
      subject: '✉️ Verify New Email',
      html: `${base}<h2 style="color:#3b82f6">✉️ Verify Your New Email</h2><p>Verify to complete email change.</p><div style="background:#eff6ff;padding:15px;border-radius:6px;margin:20px 0;border-left:4px solid #3b82f6"><p><strong>Previous Email:</strong> ${meta.oldEmail||'Unknown'}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p></div><a href="${meta.confirmationLink||'https://alaskapay.com/verify-email'}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#3b82f6;color:white;text-decoration:none;border-radius:6px;font-weight:bold">Verify Email</a><p style="color:#6b7280;font-size:14px;margin-top:20px">Ignore if you didn't request this.</p>${foot}`
    },
    two_factor_change: {
      subject: '🔐 2FA Changed',
      html: `${base}<h2 style="color:${meta.action==='disabled'?'#dc2626':'#059669'}">🔐 Two-Factor Authentication ${meta.action==='enabled'?'Enabled':meta.action==='disabled'?'Disabled':'Modified'}</h2><p>Your 2FA settings were changed.</p><div style="background:${meta.action==='disabled'?'#fef2f2':'#f0fdf4'};padding:15px;border-radius:6px;margin:20px 0;border-left:4px solid ${meta.action==='disabled'?'#dc2626':'#059669'}"><p><strong>Action:</strong> ${meta.action==='enabled'?'2FA Enabled':meta.action==='disabled'?'2FA Disabled':meta.action==='backup_codes_regenerated'?'Backup Codes Regenerated':'Modified'}</p><p><strong>Device:</strong> ${meta.device||'Unknown'}</p><p><strong>IP:</strong> ${meta.ipAddress||'Unknown'}</p><p><strong>Location:</strong> ${meta.location||'Unknown'}</p><p><strong>Time:</strong> ${meta.timestamp||new Date().toISOString()}</p></div><p style="color:#dc2626;font-weight:bold">If not you, contact support immediately.</p><a href="https://alaskapay.com/profile" style="display:inline-block;margin-top:20px;padding:12px 24px;background:${meta.action==='disabled'?'#dc2626':'#059669'};color:white;text-decoration:none;border-radius:6px">Review Security</a>${foot}`
    }

  };


  return t[type] || t.new_device_login;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not configured');
    const supabase = createClient(Deno.env.get('SUPABASE_URL')??'', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')??'');
    const { userId, alertType, metadata } = await req.json();
    const { data: prefs } = await supabase.from('notification_preferences').select('*').eq('user_id', userId).single();
    const prefKey: any = {new_device_login:'new_device_login',failed_login:'failed_login_attempts',large_transaction:'large_transactions',password_change:'password_changes',email_change:'email_changes',two_factor_change:'two_factor_changes'}[alertType];
    if (prefs && prefKey && !prefs[prefKey]) return new Response(JSON.stringify({sent:false,reason:'Disabled'}),{headers:{...corsHeaders,'Content-Type':'application/json'}});
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    if (!user?.email) throw new Error('User not found');
    const template = getTemplate(alertType, metadata);
    await supabase.from('notification_history').insert({user_id:userId,notification_type:alertType,title:template.subject,message:template.html.replace(/<[^>]*>/g,''),metadata});
    await sendEmail(user.email, template.subject, template.html);
    return new Response(JSON.stringify({sent:true,email:user.email}),{headers:{...corsHeaders,'Content-Type':'application/json'}});
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({error:error.message}),{status:400,headers:{...corsHeaders,'Content-Type':'application/json'}});
  }
});
