import { supabase } from '@/lib/supabase';

// Simple encryption (in production, use proper encryption library)
const encrypt = (text: string): string => {
  return btoa(text);
};

const decrypt = (encrypted: string): string => {
  return atob(encrypted);
};

export interface EnvironmentSecret {
  id: string;
  key_name: string;
  encrypted_value?: string;
  decrypted_value?: string;
  description?: string;
  category: string;
  is_active: boolean;
  last_rotated_at?: string;
  created_at: string;
  updated_at: string;
}

export const secretsService = {
  async listSecrets() {
    const { data, error } = await supabase
      .from('environment_secrets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(secret => ({
      ...secret,
      encrypted_value: '***HIDDEN***',
      has_value: !!secret.encrypted_value
    }));
  },

  async getSecret(id: string) {
    const { data, error } = await supabase
      .from('environment_secrets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      decrypted_value: decrypt(data.encrypted_value)
    };
  },

  async createSecret(keyName: string, value: string, description: string, category: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('environment_secrets')
      .insert({
        key_name: keyName,
        encrypted_value: encrypt(value),
        description,
        category,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) throw error;

    await this.logAudit(data.id, keyName, 'created', user?.id);
    return data;
  },

  async updateSecret(id: string, updates: Partial<EnvironmentSecret>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const updateData: any = { updated_at: new Date().toISOString(), updated_by: user?.id };
    
    if (updates.decrypted_value) {
      updateData.encrypted_value = encrypt(updates.decrypted_value);
    }
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category) updateData.category = updates.category;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

    const { error } = await supabase
      .from('environment_secrets')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    const { data: secret } = await supabase
      .from('environment_secrets')
      .select('key_name')
      .eq('id', id)
      .single();

    await this.logAudit(id, secret?.key_name || '', 'updated', user?.id);
  },

  async deleteSecret(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: secret } = await supabase
      .from('environment_secrets')
      .select('key_name')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('environment_secrets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await this.logAudit(id, secret?.key_name || '', 'deleted', user?.id);
  },

  async rotateSecret(id: string, newValue: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('environment_secrets')
      .update({
        encrypted_value: encrypt(newValue),
        last_rotated_at: new Date().toISOString(),
        updated_by: user?.id
      })
      .eq('id', id);

    if (error) throw error;

    const { data: secret } = await supabase
      .from('environment_secrets')
      .select('key_name')
      .eq('id', id)
      .single();

    await this.logAudit(id, secret?.key_name || '', 'rotated', user?.id);
  },

  async logAudit(secretId: string, keyName: string, action: string, userId?: string) {
    await supabase.from('secrets_audit_logs').insert({
      secret_id: secretId,
      key_name: keyName,
      action,
      performed_by: userId
    });
  },

  async getAuditLogs(secretId?: string) {
    let query = supabase
      .from('secrets_audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (secretId) {
      query = query.eq('secret_id', secretId);
    }

    const { data, error } = await query.limit(100);
    if (error) throw error;
    return data;
  }
};