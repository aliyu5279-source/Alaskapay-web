-- Email Domain Authentication System
-- SPF, DKIM, and DMARC configuration for custom email sending domains

-- Email sending domains
CREATE TABLE email_sending_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, verifying, verified, failed
  verification_token VARCHAR(255) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- SPF Configuration
  spf_record TEXT,
  spf_status VARCHAR(50) DEFAULT 'pending',
  spf_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- DKIM Configuration
  dkim_selector VARCHAR(100) DEFAULT 'alaskapay',
  dkim_public_key TEXT,
  dkim_private_key TEXT,
  dkim_record TEXT,
  dkim_status VARCHAR(50) DEFAULT 'pending',
  dkim_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- DMARC Configuration
  dmarc_record TEXT,
  dmarc_policy VARCHAR(50) DEFAULT 'quarantine', -- none, quarantine, reject
  dmarc_status VARCHAR(50) DEFAULT 'pending',
  dmarc_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Reputation
  reputation_score INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  complaint_rate DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email deliverability tests
CREATE TABLE email_deliverability_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES email_sending_domains(id) ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL, -- spf, dkim, dmarc, full
  status VARCHAR(50) DEFAULT 'running',
  
  -- Test results
  spf_pass BOOLEAN,
  dkim_pass BOOLEAN,
  dmarc_pass BOOLEAN,
  spam_score DECIMAL(5,2),
  
  -- Details
  test_email VARCHAR(255),
  results JSONB,
  errors JSONB,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Domain reputation history
CREATE TABLE domain_reputation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES email_sending_domains(id) ON DELETE CASCADE,
  reputation_score INTEGER NOT NULL,
  bounce_rate DECIMAL(5,2),
  complaint_rate DECIMAL(5,2),
  emails_sent INTEGER DEFAULT 0,
  emails_delivered INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DNS validation logs
CREATE TABLE dns_validation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES email_sending_domains(id) ON DELETE CASCADE,
  record_type VARCHAR(50) NOT NULL, -- SPF, DKIM, DMARC
  expected_value TEXT NOT NULL,
  actual_value TEXT,
  status VARCHAR(50) NOT NULL, -- valid, invalid, missing
  validation_details JSONB,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_domains_status ON email_sending_domains(status);
CREATE INDEX idx_deliverability_tests_domain ON email_deliverability_tests(domain_id);
CREATE INDEX idx_reputation_history_domain ON domain_reputation_history(domain_id, recorded_at DESC);
CREATE INDEX idx_dns_validation_domain ON dns_validation_logs(domain_id, validated_at DESC);
