import { supabase } from './supabase';

export type AdminActionType =
  | 'user_created' | 'user_updated' | 'user_deleted' | 'user_suspended'
  | 'transaction_approved' | 'transaction_rejected' | 'transaction_refunded'
  | 'kyc_approved' | 'kyc_rejected' | 'kyc_reviewed'
  | 'settings_updated' | 'role_changed' | 'permissions_updated'
  | 'data_exported' | 'report_generated' | 'bulk_operation'
  | 'webhook_configured' | 'api_key_created' | 'api_key_revoked'
  | 'fraud_rule_updated' | 'commission_processed' | 'withdrawal_approved'
  | 'template_created' | 'template_updated' | 'campaign_sent'
  | 'segment_created' | 'automation_triggered' | 'system_config_changed';

interface LogActivityParams {
  actionType: AdminActionType;
  targetResource?: string;
  targetId?: string;
  changesMade?: Record<string, any>;
  metadata?: Record<string, any>;
  status?: 'success' | 'failed' | 'pending';
  errorMessage?: string;
}

export async function logAdminActivity(params: LogActivityParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('admin_activity_logs')
      .insert({
        admin_id: user.id,
        action_type: params.actionType,
        target_resource: params.targetResource,
        target_id: params.targetId,
        changes_made: params.changesMade,
        metadata: params.metadata,
        status: params.status || 'success',
        error_message: params.errorMessage,
      });

    if (error) console.error('Failed to log admin activity:', error);
    return data;
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
}
