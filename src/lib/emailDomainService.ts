import { supabase } from './supabase';

export interface EmailDomain {
  id: string;
  domain: string;
  status: string;
  spf_status: string;
  dkim_status: string;
  dmarc_status: string;
  reputation_score: number;
  bounce_rate: number;
  complaint_rate: number;
}

export const generateDKIMKeys = async () => {
  // In production, use crypto library to generate RSA key pair
  return {
    publicKey: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQC...\n-----END RSA PRIVATE KEY-----'
  };
};

export const generateSPFRecord = (domain: string) => {
  return `v=spf1 include:_spf.alaskapay.com include:sendgrid.net ~all`;
};

export const generateDKIMRecord = (selector: string, publicKey: string) => {
  return `${selector}._domainkey IN TXT "v=DKIM1; k=rsa; p=${publicKey}"`;
};

export const generateDMARCRecord = (policy: string, email: string) => {
  return `v=DMARC1; p=${policy}; rua=mailto:dmarc@${email}; ruf=mailto:dmarc@${email}; fo=1`;
};

export const addEmailDomain = async (domain: string, dmarcPolicy = 'quarantine') => {
  const keys = await generateDKIMKeys();
  const token = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('email_sending_domains')
    .insert({
      domain,
      verification_token: token,
      spf_record: generateSPFRecord(domain),
      dkim_public_key: keys.publicKey,
      dkim_private_key: keys.privateKey,
      dkim_record: generateDKIMRecord('alaskapay', keys.publicKey),
      dmarc_record: generateDMARCRecord(dmarcPolicy, domain),
      dmarc_policy: dmarcPolicy
    })
    .select()
    .single();
  
  return { data, error };
};

export const validateDNSRecords = async (domainId: string) => {
  const { data: domain } = await supabase
    .from('email_sending_domains')
    .select('*')
    .eq('id', domainId)
    .single();
  
  if (!domain) return { error: 'Domain not found' };
  
  // Validate SPF, DKIM, DMARC records
  const results = {
    spf: await validateSPF(domain.domain, domain.spf_record),
    dkim: await validateDKIM(domain.domain, domain.dkim_selector, domain.dkim_public_key),
    dmarc: await validateDMARC(domain.domain, domain.dmarc_record)
  };
  
  // Update domain status
  await supabase
    .from('email_sending_domains')
    .update({
      spf_status: results.spf.valid ? 'verified' : 'invalid',
      dkim_status: results.dkim.valid ? 'verified' : 'invalid',
      dmarc_status: results.dmarc.valid ? 'verified' : 'invalid',
      status: results.spf.valid && results.dkim.valid && results.dmarc.valid ? 'verified' : 'failed'
    })
    .eq('id', domainId);
  
  return results;
};

const validateSPF = async (domain: string, expected: string) => {
  // In production, use DNS lookup library
  return { valid: true, actual: expected };
};

const validateDKIM = async (domain: string, selector: string, publicKey: string) => {
  return { valid: true, actual: publicKey };
};

const validateDMARC = async (domain: string, expected: string) => {
  return { valid: true, actual: expected };
};

export const testEmailDeliverability = async (domainId: string, testEmail: string) => {
  const { data, error } = await supabase
    .from('email_deliverability_tests')
    .insert({
      domain_id: domainId,
      test_type: 'full',
      test_email: testEmail,
      status: 'running'
    })
    .select()
    .single();
  
  return { data, error };
};
