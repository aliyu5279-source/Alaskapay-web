import { supabase } from './supabase';

interface AuditLogParams {
  actionType: 'create' | 'update' | 'delete' | 'override' | 'role_change';
  resourceType: 'user' | 'role' | 'service' | 'transaction';
  resourceId: string;
  description: string;
  beforeValue?: any;
  afterValue?: any;
  metadata?: any;
}

export const logAdminAction = async (params: AuditLogParams) => {
  try {
    // Get device info
    const userAgent = navigator.userAgent;
    const deviceInfo = `${navigator.platform} - ${navigator.vendor}`;
    
    // Get IP address (approximate)
    let ipAddress = 'Unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (e) {
      console.warn('Could not fetch IP address');
    }

    const { data, error } = await supabase.functions.invoke('log-admin-action', {
      body: {
        action_type: params.actionType,
        resource_type: params.resourceType,
        resource_id: params.resourceId,
        description: params.description,
        before_value: params.beforeValue,
        after_value: params.afterValue,
        ip_address: ipAddress,
        device_info: deviceInfo,
        user_agent: userAgent,
        metadata: params.metadata
      }
    });

    if (error) {
      console.error('Failed to log admin action:', error);
    }

    return { data, error };
  } catch (error) {
    console.error('Error logging admin action:', error);
    return { data: null, error };
  }
};
