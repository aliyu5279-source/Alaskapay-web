import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RefreshCw, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { SSLCertificateMonitor } from './SSLCertificateMonitor';
import { DNSRecordStatus } from './DNSRecordStatus';
import { EmailAuthScoreCard } from './EmailAuthScoreCard';
import { 
  checkSSLCertificate, 
  checkDNSRecords, 
  checkEmailAuth, 
  checkSubdomainHealth,
  SSLCertificate,
  DNSRecord,
  EmailAuthScore,
  SubdomainHealth
} from '../../lib/domainHealthService';

export const DomainHealthMonitoringTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState<SSLCertificate[]>([]);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [emailScore, setEmailScore] = useState<EmailAuthScore | null>(null);
  const [subdomains, setSubdomains] = useState<SubdomainHealth[]>([]);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const domains = ['alaskapay.ng', 'admin.alaskapay.ng', 'api.alaskapay.ng'];
      const certs = await Promise.all(domains.map(d => checkSSLCertificate(d)));
      const dns = await checkDNSRecords('alaskapay.ng');
      const email = await checkEmailAuth('alaskapay.ng');
      const subs = await checkSubdomainHealth();
      
      setCertificates(certs);
      setDnsRecords(dns);
      setEmailScore(email);
      setSubdomains(subs);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, []);

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.5) return 'text-green-600';
    if (uptime >= 98) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Domain Health Monitoring</h2>
          <p className="text-gray-600 mt-1">
            Last checked: {lastCheck.toLocaleString()}
          </p>
        </div>
        <Button onClick={loadHealthData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SSL Status</p>
                <p className="text-2xl font-bold text-green-600">Valid</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">DNS Health</p>
                <p className="text-2xl font-bold text-green-600">100%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email Auth</p>
                <p className="text-2xl font-bold text-green-600">{emailScore?.overallScore}%</p>
              </div>
              <AlertCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SSLCertificateMonitor certificates={certificates} />
        {emailScore && <EmailAuthScoreCard score={emailScore} />}
      </div>

      <DNSRecordStatus records={dnsRecords} />

      <Card>
        <CardHeader>
          <CardTitle>Subdomain Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subdomains.map((sub, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{sub.subdomain}</span>
                  <Badge className={sub.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {sub.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Uptime</span>
                    <p className={`font-bold ${getUptimeColor(sub.uptime)}`}>{sub.uptime}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Response Time</span>
                    <p className="font-bold">{sub.responseTime}ms</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Check</span>
                    <p className="font-medium">{new Date(sub.lastCheck).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
