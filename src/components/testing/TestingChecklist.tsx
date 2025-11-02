import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const checklistData = {
  authentication: [
    'New user signup flow',
    'Email verification',
    'Login with credentials',
    '2FA setup and verification',
    'Biometric login (mobile)',
    'Password reset flow',
    'Session timeout handling',
    'Logout functionality'
  ],
  wallet: [
    'View wallet balance',
    'Link bank account',
    'Top up wallet (card)',
    'Transfer to user',
    'Transfer to bank',
    'Withdraw funds',
    'Transaction history',
    'Multi-currency display'
  ],
  payments: [
    'Bill payment flow',
    'Virtual card creation',
    'Card funding',
    'Scheduled payments',
    'Payment receipts',
    'Transaction limits',
    'Failed payment handling'
  ],
  security: [
    'Password hashing verified',
    'JWT tokens secure',
    '2FA enforced',
    'HTTPS enabled',
    'API keys protected',
    'Rate limiting active',
    'Fraud detection enabled',
    'Audit logging active'
  ]
};

export default function TestingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getProgress = (items: string[]) => {
    const total = items.length;
    const completed = items.filter(item => checked[item]).length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testing Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="authentication">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="authentication">Auth</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {Object.entries(checklistData).map(([key, items]) => {
            const progress = getProgress(items);
            return (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={progress.percentage === 100 ? 'default' : 'secondary'}>
                    {progress.completed}/{progress.total} Complete
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {progress.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={checked[item] || false}
                        onCheckedChange={() => toggleCheck(item)}
                      />
                      <label htmlFor={item} className="text-sm cursor-pointer">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}