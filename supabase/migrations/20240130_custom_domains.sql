-- Custom Domain Management System
CREATE TABLE IF NOT EXISTS custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain VARCHAR(255) UNIQUE NOT NULL,
  subdomain VARCHAR(100),
  full_domain VARCHAR(255) UNIQUE NOT NULL,
  domain_type VARCHAR(20) NOT NULL CHECK (domain_type IN ('web', 'api', 'both')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'verified', 'active', 'failed', 'suspended')),
  verification_method VARCHAR(20) DEFAULT 'dns' CHECK (verification_method IN ('dns', 'http', 'email')),
  verification_token VARCHAR(255),
  verification_record TEXT,
  ssl_status VARCHAR(20) DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'provisioning', 'active', 'failed', 'renewing')),
  ssl_provider VARCHAR(50) DEFAULT 'letsencrypt',
  ssl_expires_at TIMESTAMPTZ,
  registrar VARCHAR(100),
  nameservers TEXT[],
  dns_configured BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DNS Records for domain configuration
CREATE TABLE IF NOT EXISTS dns_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES custom_domains(id) ON DELETE CASCADE,
  record_type VARCHAR(10) NOT NULL CHECK (record_type IN ('A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS')),
  name VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  ttl INTEGER DEFAULT 3600,
  priority INTEGER,
  is_required BOOLEAN DEFAULT true,
  is_configured BOOLEAN DEFAULT false,
  purpose VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Domain verification logs
CREATE TABLE IF NOT EXISTS domain_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES custom_domains(id) ON DELETE CASCADE,
  verification_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  details JSONB,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- SSL Certificate tracking
CREATE TABLE IF NOT EXISTS ssl_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES custom_domains(id) ON DELETE CASCADE,
  certificate_data TEXT,
  private_key_encrypted TEXT,
  chain_data TEXT,
  issuer VARCHAR(255),
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  last_renewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_custom_domains_status ON custom_domains(status);
CREATE INDEX idx_custom_domains_domain ON custom_domains(full_domain);
CREATE INDEX idx_dns_records_domain ON dns_records(domain_id);
CREATE INDEX idx_ssl_expires ON ssl_certificates(expires_at);

-- RLS Policies
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssl_certificates ENABLE ROW LEVEL SECURITY;

-- Admin only access
CREATE POLICY admin_custom_domains ON custom_domains FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_dns_records ON dns_records FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_verification_logs ON domain_verification_logs FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_ssl_certs ON ssl_certificates FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
