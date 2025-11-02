export function generateDigestEmail(
  schedule: string,
  critical: any[],
  warning: any[],
  info: any[]
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .stat { display: inline-block; margin: 10px 20px 10px 0; }
    .stat-number { font-size: 32px; font-weight: bold; }
    .critical { color: #dc2626; }
    .warning { color: #f59e0b; }
    .info { color: #3b82f6; }
    .notification { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #e5e7eb; border-radius: 4px; }
    .notification.critical { border-left-color: #dc2626; }
    .notification.warning { border-left-color: #f59e0b; }
    .notification-title { font-weight: bold; margin-bottom: 5px; }
    .notification-time { font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Admin Notification Digest</h1>
      <p>${schedule.charAt(0).toUpperCase() + schedule.slice(1)} Summary</p>
    </div>
    <div class="content">
      <div class="summary">
        <h2>Summary</h2>
        <div class="stat">
          <div class="stat-number critical">${critical.length}</div>
          <div>Critical</div>
        </div>
        <div class="stat">
          <div class="stat-number warning">${warning.length}</div>
          <div>Warning</div>
        </div>
        <div class="stat">
          <div class="stat-number info">${info.length}</div>
          <div>Info</div>
        </div>
      </div>

      ${critical.length > 0 ? `
        <h3 style="color: #dc2626;">🚨 Critical Notifications</h3>
        ${critical.map(n => `
          <div class="notification critical">
            <div class="notification-title">${n.title}</div>
            <div>${n.message}</div>
            <div class="notification-time">${new Date(n.created_at).toLocaleString()}</div>
          </div>
        `).join('')}
      ` : ''}

      ${warning.length > 0 ? `
        <h3 style="color: #f59e0b;">⚠️ Warnings</h3>
        ${warning.slice(0, 5).map(n => `
          <div class="notification warning">
            <div class="notification-title">${n.title}</div>
            <div>${n.message}</div>
          </div>
        `).join('')}
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}
