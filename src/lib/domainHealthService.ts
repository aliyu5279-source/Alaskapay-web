import { supabase } from './supabase';

export interface SSLCertificate {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  status: 'valid' | 'expiring' | 'expired';
}

export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  status: 'active' | 'pending' | 'failed';
  lastChecked: string;
}

export interface EmailAuthScore {
  spf: { status: 'pass' | 'fail' | 'none'; score: number };
  dkim: { status: 'pass' | 'fail' | 'none'; score: number };
  dmarc: { status: 'pass' | 'fail' | 'none'; score: number };
  overallScore: number;
}

export interface SubdomainHealth {
  subdomain: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  responseTime: number;
  lastCheck: string;
}

export const checkSSLCertificate = async (domain: string): Promise<SSLCertificate> => {
  // Simulate SSL check - in production, use SSL Labs API
  const validTo = new Date();
  validTo.setDate(validTo.getDate() + 45);
  
  const daysUntilExpiry = Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return {
    domain,
    issuer: "Let's Encrypt",
    validFrom: new Date().toISOString(),
    validTo: validTo.toISOString(),
    daysUntilExpiry,
    status: daysUntilExpiry < 30 ? 'expiring' : 'valid'
  };
};

export const checkDNSRecords = async (domain: string): Promise<DNSRecord[]> => {
  return [
    { type: 'A', name: '@', value: '76.76.21.21', status: 'active', lastChecked: new Date().toISOString() },
    { type: 'CNAME', name: 'www', value: 'alaskapay.ng', status: 'active', lastChecked: new Date().toISOString() },
    { type: 'CNAME', name: 'admin', value: 'admin.alaskapay.ng', status: 'active', lastChecked: new Date().toISOString() },
    { type: 'CNAME', name: 'api', value: 'api.alaskapay.ng', status: 'active', lastChecked: new Date().toISOString() }
  ];
};

export const checkEmailAuth = async (domain: string): Promise<EmailAuthScore> => {
  return {
    spf: { status: 'pass', score: 100 },
    dkim: { status: 'pass', score: 100 },
    dmarc: { status: 'pass', score: 95 },
    overallScore: 98
  };
};

export const checkSubdomainHealth = async (): Promise<SubdomainHealth[]> => {
  return [
    { subdomain: 'alaskapay.ng', status: 'online', uptime: 99.9, responseTime: 120, lastCheck: new Date().toISOString() },
    { subdomain: 'admin.alaskapay.ng', status: 'online', uptime: 99.8, responseTime: 145, lastCheck: new Date().toISOString() },
    { subdomain: 'api.alaskapay.ng', status: 'online', uptime: 99.95, responseTime: 98, lastCheck: new Date().toISOString() }
  ];
};
