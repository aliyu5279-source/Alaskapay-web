import { supabase } from './supabase';

export interface SecurityAlertMetadata {
  device?: string;
  location?: string;
  timestamp?: string;
  attempts?: number;
  amount?: number;
  recipient?: string;
  newEmail?: string;
  enabled?: boolean;
  ipAddress?: string;
}

export type AlertType = 
  | 'new_device_login'
  | 'failed_login'
  | 'large_transaction'
  | 'password_change'
  | 'email_change'
  | 'two_factor_change';

/**
 * Send a security alert email via SendGrid
 * @param userId - The user ID to send the alert to
 * @param alertType - Type of security alert
 * @param metadata - Additional information about the alert
 */
export async function sendSecurityAlert(
  userId: string,
  alertType: AlertType,
  metadata: SecurityAlertMetadata
) {
  try {
    const { data, error } = await supabase.functions.invoke('send-security-alert', {
      body: {
        userId,
        alertType,
        metadata: {
          ...metadata,
          timestamp: metadata.timestamp || new Date().toISOString(),
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send security alert:', error);
    throw error;
  }
}

/**
 * Helper to detect device information from user agent
 */
export function getDeviceInfo(): string {
  const ua = navigator.userAgent;
  let device = 'Unknown Device';
  
  if (ua.includes('Windows')) device = 'Windows PC';
  else if (ua.includes('Mac')) device = 'Mac';
  else if (ua.includes('Linux')) device = 'Linux PC';
  else if (ua.includes('iPhone')) device = 'iPhone';
  else if (ua.includes('iPad')) device = 'iPad';
  else if (ua.includes('Android')) device = 'Android Device';
  
  if (ua.includes('Chrome')) device += ' - Chrome';
  else if (ua.includes('Safari')) device += ' - Safari';
  else if (ua.includes('Firefox')) device += ' - Firefox';
  else if (ua.includes('Edge')) device += ' - Edge';
  
  return device;
}

/**
 * Get approximate location from IP (requires external service or browser API)
 */
export async function getApproximateLocation(): Promise<string> {
  try {
    // Using ipapi.co free service (1000 requests/day)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return `${data.city}, ${data.region}, ${data.country_name}`;
  } catch {
    return 'Unknown Location';
  }
}
