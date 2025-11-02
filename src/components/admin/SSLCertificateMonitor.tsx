import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { SSLCertificate } from '../../lib/domainHealthService';

interface SSLCertificateMonitorProps {
  certificates: SSLCertificate[];
}

export const SSLCertificateMonitor: React.FC<SSLCertificateMonitorProps> = ({ certificates }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'expiring': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'expired': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          SSL Certificates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certificates.map((cert, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(cert.status)}
                  <span className="font-semibold">{cert.domain}</span>
                </div>
                <Badge className={getStatusColor(cert.status)}>
                  {cert.status.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Issuer:</span>
                  <p className="font-medium">{cert.issuer}</p>
                </div>
                <div>
                  <span className="text-gray-600">Days Until Expiry:</span>
                  <p className="font-medium">{cert.daysUntilExpiry} days</p>
                </div>
                <div>
                  <span className="text-gray-600">Valid From:</span>
                  <p className="font-medium">{new Date(cert.validFrom).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Valid To:</span>
                  <p className="font-medium">{new Date(cert.validTo).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
