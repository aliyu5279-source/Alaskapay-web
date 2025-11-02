// Email template generator for security alerts
export function getEmailTemplate(
  alertType: string,
  metadata: any,
  userEmail: string
): { subject: string; html: string } {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  `;
  
  const footer = `
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>This is an automated security alert from Alaska Pay</p>
        <p>If you have questions, contact support@alaskapay.com</p>
      </div>
    </div>
  `;

  const templates: Record<string, { subject: string; html: string }> = {
    new_device_login: {
      subject: '🔐 New Device Login Detected',
      html: `${baseStyle}
        <h2 style="color: #1f2937; margin-bottom: 20px;">🔐 New Device Login Detected</h2>
        <p style="color: #4b5563; line-height: 1.6;">A login to your Alaska Pay account was detected from a new device.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Device:</strong> ${metadata.device || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${metadata.location || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${metadata.timestamp || new Date().toISOString()}</p>
        </div>
        <p style="color: #dc2626; font-weight: bold;">If this wasn't you, secure your account immediately.</p>
        <a href="https://alaskapay.com/profile" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Review Account Activity</a>
      ${footer}`,
    },
    failed_login: {
      subject: '⚠️ Multiple Failed Login Attempts',
      html: `${baseStyle}
        <h2 style="color: #dc2626; margin-bottom: 20px;">⚠️ Multiple Failed Login Attempts</h2>
        <p style="color: #4b5563; line-height: 1.6;">We detected multiple failed login attempts on your account.</p>
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 5px 0;"><strong>Attempts:</strong> ${metadata.attempts || 'Multiple'}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${metadata.location || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${metadata.timestamp || new Date().toISOString()}</p>
        </div>
        <p style="color: #dc2626; font-weight: bold;">Your account may be under attack. Change your password immediately.</p>
        <a href="https://alaskapay.com/reset-password" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px;">Change Password</a>
      ${footer}`,
    },
    large_transaction: {
      subject: '💰 Large Transaction Alert',
      html: `${baseStyle}
        <h2 style="color: #f59e0b; margin-bottom: 20px;">💰 Large Transaction Alert</h2>
        <p style="color: #4b5563; line-height: 1.6;">A large transaction was processed on your Alaska Pay account.</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 8px 0; font-size: 16px;"><strong>Amount:</strong> <span style="color: #f59e0b; font-size: 20px;">₦${metadata.amount?.toLocaleString() || '0.00'}</span></p>
          <p style="margin: 8px 0;"><strong>Description:</strong> ${metadata.description || 'Transaction'}</p>
          <p style="margin: 8px 0;"><strong>Recipient:</strong> ${metadata.recipient || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Transaction ID:</strong> ${metadata.transactionId || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${new Date(metadata.timestamp || Date.now()).toLocaleString()}</p>
          <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${metadata.status || 'Completed'}</span></p>
        </div>
        <p style="color: #92400e; font-weight: 500; background-color: #fef3c7; padding: 12px; border-radius: 6px;">⚠️ If you didn't authorize this transaction, contact support immediately.</p>
        <a href="https://alaskapay.com/dashboard" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">View Transaction Details</a>
      ${footer}`,
    },
    password_change: {
      subject: '🔒 Password Changed Successfully',
      html: `${baseStyle}
        <h2 style="color: #059669; margin-bottom: 20px;">🔒 Password Changed Successfully</h2>
        <p style="color: #4b5563; line-height: 1.6;">Your Alaska Pay account password was successfully changed.</p>
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669;">
          <p style="margin: 5px 0;"><strong>Device:</strong> ${metadata.device || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>IP Address:</strong> ${metadata.ipAddress || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${metadata.location || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date(metadata.timestamp || Date.now()).toLocaleString()}</p>
        </div>
        <p style="color: #dc2626; font-weight: bold; background-color: #fef2f2; padding: 12px; border-radius: 6px;">⚠️ If you didn't make this change, your account may be compromised. Contact support immediately.</p>
        <a href="https://alaskapay.com/profile" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px;">Review Account Security</a>
      ${footer}`,
    },
    email_change_old: {
      subject: '⚠️ Email Change Request - Verification Required',
      html: `${baseStyle}
        <h2 style="color: #dc2626; margin-bottom: 20px;">⚠️ Email Change Request</h2>
        <p style="color: #4b5563; line-height: 1.6;">A request was made to change the email address associated with your Alaska Pay account.</p>
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 5px 0;"><strong>Current Email:</strong> ${userEmail}</p>
          <p style="margin: 5px 0;"><strong>New Email:</strong> ${metadata.newEmail || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Device:</strong> ${metadata.device || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>IP Address:</strong> ${metadata.ipAddress || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${metadata.location || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date(metadata.timestamp || Date.now()).toLocaleString()}</p>
        </div>
        <p style="color: #dc2626; font-weight: bold; background-color: #fef2f2; padding: 12px; border-radius: 6px;">⚠️ If you didn't request this change, your account may be compromised. Contact support immediately and change your password.</p>
        <p style="color: #4b5563; margin-top: 20px;">The email change will not take effect until the new email address is verified.</p>
        <a href="https://alaskapay.com/profile" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px;">Secure My Account</a>
      ${footer}`,
    },
    email_change_new: {
      subject: '✉️ Verify Your New Email Address',
      html: `${baseStyle}
        <h2 style="color: #3b82f6; margin-bottom: 20px;">✉️ Verify Your New Email Address</h2>
        <p style="color: #4b5563; line-height: 1.6;">Please verify this email address to complete your Alaska Pay account email change.</p>
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 5px 0;"><strong>Previous Email:</strong> ${metadata.oldEmail || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>New Email:</strong> ${userEmail}</p>
          <p style="margin: 5px 0;"><strong>Request Time:</strong> ${new Date(metadata.timestamp || Date.now()).toLocaleString()}</p>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">Click the button below to verify this email address. This link will expire in 24 hours.</p>
        <a href="${metadata.confirmationLink || 'https://alaskapay.com/verify-email'}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you didn't request this change, you can safely ignore this email.</p>
      ${footer}`,
    },
    two_factor_change: {
      subject: '🔐 Two-Factor Authentication Changed',
      html: `${baseStyle}
        <h2 style="color: ${metadata.action === 'disabled' ? '#dc2626' : '#059669'}; margin-bottom: 20px;">🔐 Two-Factor Authentication ${metadata.action === 'enabled' ? 'Enabled' : metadata.action === 'disabled' ? 'Disabled' : 'Modified'}</h2>
        <p style="color: #4b5563; line-height: 1.6;">Your Alaska Pay account two-factor authentication settings were changed.</p>
        <div style="background-color: ${metadata.action === 'disabled' ? '#fef2f2' : '#f0fdf4'}; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${metadata.action === 'disabled' ? '#dc2626' : '#059669'};">
          <p style="margin: 5px 0;"><strong>Action:</strong> ${metadata.action === 'enabled' ? 'Two-Factor Authentication Enabled' : metadata.action === 'disabled' ? 'Two-Factor Authentication Disabled' : metadata.action === 'backup_codes_regenerated' ? 'Backup Codes Regenerated' : 'Settings Modified'}</p>
          <p style="margin: 5px 0;"><strong>Device:</strong> ${metadata.device || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>IP Address:</strong> ${metadata.ipAddress || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${metadata.location || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date(metadata.timestamp || Date.now()).toLocaleString()}</p>
        </div>
        ${metadata.action === 'disabled' ? `
          <p style="color: #dc2626; font-weight: bold; background-color: #fef2f2; padding: 12px; border-radius: 6px;">⚠️ Warning: Your account is now less secure without two-factor authentication. We strongly recommend re-enabling it.</p>
        ` : metadata.action === 'enabled' ? `
          <p style="color: #059669; font-weight: bold; background-color: #f0fdf4; padding: 12px; border-radius: 6px;">✓ Your account is now more secure with two-factor authentication enabled.</p>
        ` : `
          <p style="color: #4b5563; background-color: #f3f4f6; padding: 12px; border-radius: 6px;">Your backup codes have been regenerated. Make sure to save them in a secure location.</p>
        `}
        <p style="color: #dc2626; font-weight: bold; margin-top: 20px;">⚠️ If you didn't make this change, your account may be compromised. Contact support immediately.</p>
        <a href="https://alaskapay.com/profile" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: ${metadata.action === 'disabled' ? '#dc2626' : '#059669'}; color: white; text-decoration: none; border-radius: 6px;">Review Account Security</a>
      ${footer}`,
    },

  };

  return templates[alertType] || templates.new_device_login;
}
