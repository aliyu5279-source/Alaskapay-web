import { supabase } from './supabase';

export interface EmailTemplate {
  id?: string;
  name: string;
  description: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  category: string;
  status: 'draft' | 'active' | 'archived';
  version?: number;
  parent_template_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const emailTemplateService = {
  async listTemplates() {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTemplate(id: string) {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createTemplate(template: EmailTemplate) {
    const { data, error } = await supabase
      .from('email_templates')
      .insert([{ ...template, version: 1 }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Create version history
    await this.createVersionHistory(data.id, template);
    
    return data;
  },

  async updateTemplate(id: string, template: Partial<EmailTemplate>) {
    const current = await this.getTemplate(id);
    
    const { data, error } = await supabase
      .from('email_templates')
      .update({ ...template, version: (current.version || 1) + 1 })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Create version history
    await this.createVersionHistory(id, data);
    
    return data;
  },

  async deleteTemplate(id: string) {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async createVersionHistory(templateId: string, template: any) {
    const { error } = await supabase
      .from('email_template_versions')
      .insert([{
        template_id: templateId,
        version: template.version || 1,
        name: template.name,
        subject: template.subject,
        html_content: template.html_content,
        text_content: template.text_content,
        variables: template.variables,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }]);
    
    if (error) throw error;
  },

  async getVersionHistory(templateId: string) {
    const { data, error } = await supabase
      .from('email_template_versions')
      .select('*')
      .eq('template_id', templateId)
      .order('version', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async rollbackToVersion(templateId: string, versionId: string) {
    const { data: version, error: vError } = await supabase
      .from('email_template_versions')
      .select('*')
      .eq('id', versionId)
      .single();
    
    if (vError) throw vError;
    
    return await this.updateTemplate(templateId, {
      name: version.name,
      subject: version.subject,
      html_content: version.html_content,
      text_content: version.text_content,
      variables: version.variables
    });
  },

  async duplicateTemplate(id: string) {
    const template = await this.getTemplate(id);
    const { id: _, created_at, updated_at, ...templateData } = template;
    
    return await this.createTemplate({
      ...templateData,
      name: `${template.name} (Copy)`,
      status: 'draft'
    });
  }
};
