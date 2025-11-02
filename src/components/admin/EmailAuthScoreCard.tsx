import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { EmailAuthScore } from '../../lib/domainHealthService';
import { Progress } from '../ui/progress';

interface EmailAuthScoreCardProps {
  score: EmailAuthScore;
}

export const EmailAuthScoreCard: React.FC<EmailAuthScoreCardProps> = ({ score }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'none': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Authentication Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(score.overallScore)}`}>
              {score.overallScore}%
            </span>
          </div>
          <Progress value={score.overallScore} className="h-3" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(score.spf.status)}
              <div>
                <p className="font-semibold">SPF Record</p>
                <p className="text-sm text-gray-600">Sender Policy Framework</p>
              </div>
            </div>
            <Badge className={score.spf.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {score.spf.score}%
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(score.dkim.status)}
              <div>
                <p className="font-semibold">DKIM Signature</p>
                <p className="text-sm text-gray-600">DomainKeys Identified Mail</p>
              </div>
            </div>
            <Badge className={score.dkim.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {score.dkim.score}%
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(score.dmarc.status)}
              <div>
                <p className="font-semibold">DMARC Policy</p>
                <p className="text-sm text-gray-600">Domain-based Message Auth</p>
              </div>
            </div>
            <Badge className={score.dmarc.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {score.dmarc.score}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
