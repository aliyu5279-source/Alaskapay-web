import { supabase } from './supabase';

export interface CustomDomain {
  id: string;
  domain: string;
  subdomain?: string;
  full_domain: string;
  domain_type: 'web' | 'api' | 'both';
  status: 'pending' | 'verifying' | 'verified' | 'active' | 'failed' | 'suspended';
  verification_method: 'dns' | 'http' | 'email';
  verification_token?: string;
  verification_record?: string;
  ssl_status: 'pending' | 'provisioning' | 'active' | 'failed' | 'renewing';
  ssl_provider: string;
  ssl_expires_at?: string;
  registrar?: string;
  nameservers?: string[];
  dns_configured: boolean;
  verified_at?: string;
  activated_at?: string;
  last_checked_at?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface DNSRecord {
  id?: string;
  domain_id: string;
  record_type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'NS';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  is_required: boolean;
  is_configured: boolean;
  purpose?: string;
}

export const domainService = {
  // Generate verification token
  generateVerificationToken(): string {
    return `alaskapay-verify-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  },

  // Add custom domain
  async addDomain(data: {
    domain: string;
    subdomain?: string;
    domain_type: 'web' | 'api' | 'both';
    registrar?: string;
  }): Promise<CustomDomain> {
    const full_domain = data.subdomain 
      ? `${data.subdomain}.${data.domain}` 
      : data.domain;
    
    const verification_token = this.generateVerificationToken();
    
    const { data: domain, error } = await supabase
      .from('custom_domains')
      .insert({
        ...data,
        full_domain,
        verification_token,
        verification_record: `${verification_token}`,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Generate required DNS records
    await this.generateDNSRecords(domain.id, data.domain_type);

    return domain;
  },

  // Generate DNS records for domain
  async generateDNSRecords(domainId: string, type: string): Promise<void> {
    const records: Partial<DNSRecord>[] = [];

    if (type === 'web' || type === 'both') {
      records.push(
        { record_type: 'A', name: '@', value: '76.76.21.21', ttl: 3600, purpose: 'Web hosting' },
        { record_type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com', ttl: 3600, purpose: 'WWW subdomain' }
      );
    }

    if (type === 'api' || type === 'both') {
      records.push(
        { record_type: 'CNAME', name: 'api', value: 'your-project.supabase.co', ttl: 3600, purpose: 'API endpoint' }
      );
    }

    // Verification TXT record
    const { data: domain } = await supabase
      .from('custom_domains')
      .select('verification_token')
      .eq('id', domainId)
      .single();

    if (domain) {
      records.push({
        record_type: 'TXT',
        name: '_alaskapay-verification',
        value: domain.verification_token,
        ttl: 3600,
        purpose: 'Domain verification'
      });
    }

    const recordsWithDomain = records.map(r => ({ ...r, domain_id: domainId, is_required: true, is_configured: false }));
    
    await supabase.from('dns_records').insert(recordsWithDomain);
  },

  // Verify domain
  async verifyDomain(domainId: string): Promise<boolean> {
    const { data: domain } = await supabase
      .from('custom_domains')
      .select('*, dns_records(*)')
      .eq('id', domainId)
      .single();

    if (!domain) throw new Error('Domain not found');

    // Check DNS records (simplified - in production, use DNS lookup)
    const allConfigured = domain.dns_records?.every((r: any) => r.is_configured) || false;

    if (allConfigured) {
      await supabase
        .from('custom_domains')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          dns_configured: true
        })
        .eq('id', domainId);

      // Log verification
      await supabase.from('domain_verification_logs').insert({
        domain_id: domainId,
        verification_type: 'dns',
        status: 'success',
        details: { message: 'All DNS records configured' }
      });

      return true;
    }

    return false;
  },

  // Get domains
  async getDomains(): Promise<CustomDomain[]> {
    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get DNS records
  async getDNSRecords(domainId: string): Promise<DNSRecord[]> {
    const { data, error } = await supabase
      .from('dns_records')
      .select('*')
      .eq('domain_id', domainId)
      .order('record_type');

    if (error) throw error;
    return data || [];
  }
};
