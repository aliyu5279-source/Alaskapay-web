import { supabase } from './supabase';

export interface FraudAlertData {
  transactionId: string;
  riskScore: number;
  amount: number;
  userId: string;
  userName: string;
  userEmail: string;
  flagReasons: string[];
}

export async function sendFraudAlert(data: FraudAlertData) {
  try {
    // Get all admin users
    const { data: admins } = await supabase
      .from('profiles')
      .select('id, email, phone, full_name')
      .eq('role', 'admin');

    if (!admins || admins.length === 0) {
      console.warn('No admin users found to send alerts');
      return;
    }

    const alertMessage = `HIGH RISK TRANSACTION DETECTED!\n\nRisk Score: ${data.riskScore}\nAmount: $${data.amount}\nUser: ${data.userName} (${data.userEmail})\nReasons: ${data.flagReasons.join(', ')}`;

    // Create dashboard alerts for all admins
    for (const admin of admins) {
      await supabase.from('fraud_alerts').insert({
        transaction_id: data.transactionId,
        admin_id: admin.id,
        alert_type: 'dashboard',
        risk_score: data.riskScore,
        transaction_amount: data.amount,
        user_id: data.userId,
        alert_message: alertMessage
      });
    }

    // For high-risk transactions, also send email/SMS via edge function
    if (data.riskScore > 70) {
      await supabase.functions.invoke('send-fraud-alert', {
        body: data
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending fraud alert:', error);
    return { success: false, error };
  }
}

export async function acknowledgeAlert(alertId: string, action?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('fraud_alerts')
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: user?.id,
        action_taken: action
      })
      .eq('id', alertId);

    return { success: true };
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    return { success: false, error };
  }
}