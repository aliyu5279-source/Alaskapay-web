const base = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb"><div style="background:white;border-radius:8px;padding:30px;box-shadow:0 2px 4px rgba(0,0,0,0.1)">`;
const foot = `</div><div style="text-align:center;margin-top:20px;color:#6b7280;font-size:12px"><p>Alaska Pay - Secure Digital Payments</p><p>support@alaskapay.com</p></div></div>`;

export function getTemplate(type: string, data: any) {
  const templates: any = {
    password_reset: {
      subject: '🔑 Reset Your Password - Alaska Pay',
      html: `${base}<h2 style="color:#3b82f6">🔑 Reset Your Password</h2><p>We received a request to reset your password.</p><div style="background:#eff6ff;padding:20px;border-radius:6px;margin:20px 0;text-align:center"><p style="margin-bottom:15px">Click the button below to reset your password:</p><a href="${data.resetLink}" style="display:inline-block;padding:14px 28px;background:#3b82f6;color:white;text-decoration:none;border-radius:6px;font-weight:bold">Reset Password</a><p style="margin-top:15px;font-size:12px;color:#6b7280">Link expires in 1 hour</p></div><p style="color:#6b7280">If you didn't request this, ignore this email.</p>${foot}`
    },
    payment_confirmation: {
      subject: '✅ Payment Confirmed - Alaska Pay',
      html: `${base}<h2 style="color:#059669">✅ Payment Confirmed</h2><p>Your payment has been processed successfully.</p><div style="background:#f0fdf4;padding:20px;border-radius:6px;margin:20px 0;border-left:4px solid #059669"><p><strong>Amount:</strong> <span style="font-size:24px;color:#059669">₦${data.amount?.toLocaleString()}</span></p><p><strong>Recipient:</strong> ${data.recipient}</p><p><strong>Reference:</strong> ${data.reference}</p><p><strong>Date:</strong> ${new Date(data.date).toLocaleString()}</p><p><strong>Status:</strong> <span style="color:#059669;font-weight:bold">Successful</span></p></div><a href="${data.receiptLink}" style="display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:6px">View Receipt</a>${foot}`
    },
    receipt: {
      subject: '🧾 Transaction Receipt - Alaska Pay',
      html: `${base}<h2>🧾 Transaction Receipt</h2><div style="background:#f3f4f6;padding:20px;border-radius:6px;margin:20px 0"><h3 style="margin-top:0">Receipt #${data.receiptNumber}</h3><hr style="border:none;border-top:1px solid #d1d5db;margin:15px 0"><p><strong>Amount:</strong> ₦${data.amount?.toLocaleString()}</p><p><strong>Fee:</strong> ₦${data.fee?.toLocaleString()}</p><p><strong>Total:</strong> ₦${(data.amount+data.fee)?.toLocaleString()}</p><hr style="border:none;border-top:1px solid #d1d5db;margin:15px 0"><p><strong>From:</strong> ${data.from}</p><p><strong>To:</strong> ${data.to}</p><p><strong>Date:</strong> ${new Date(data.date).toLocaleString()}</p><p><strong>Reference:</strong> ${data.reference}</p></div><a href="${data.downloadLink}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:white;text-decoration:none;border-radius:6px">Download PDF</a>${foot}`
    },
    welcome: {
      subject: '👋 Welcome to Alaska Pay!',
      html: `${base}<h2 style="color:#3b82f6">👋 Welcome to Alaska Pay!</h2><p>Thanks for joining Alaska Pay. We're excited to have you!</p><div style="background:#eff6ff;padding:20px;border-radius:6px;margin:20px 0"><h3 style="margin-top:0">Get Started:</h3><ul style="line-height:1.8"><li>Complete your profile</li><li>Add a payment method</li><li>Verify your identity for higher limits</li><li>Start sending and receiving money</li></ul></div><a href="https://alaskapay.com/dashboard" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:white;text-decoration:none;border-radius:6px">Go to Dashboard</a>${foot}`
    },
    verification_success: {
      subject: '✅ Account Verified - Alaska Pay',
      html: `${base}<h2 style="color:#059669">✅ Account Verified!</h2><p>Congratulations! Your account has been verified.</p><div style="background:#f0fdf4;padding:20px;border-radius:6px;margin:20px 0;border-left:4px solid #059669"><p><strong>Verification Level:</strong> ${data.level}</p><p><strong>New Limits:</strong></p><ul><li>Daily: ₦${data.dailyLimit?.toLocaleString()}</li><li>Monthly: ₦${data.monthlyLimit?.toLocaleString()}</li></ul></div><a href="https://alaskapay.com/dashboard" style="display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:6px">Start Transacting</a>${foot}`
    }
  };
  return templates[type] || templates.welcome;
}
