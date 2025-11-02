import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SMSPreferences() {
  const [phone, setPhone] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">SMS Notifications</h3>
      <div className="space-y-4">
        <div>
          <Label>Phone Number</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." />
        </div>
        <div className="flex items-center justify-between">
          <Label>Enable SMS Notifications</Label>
          <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Transaction Alerts</Label>
          <Switch checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Security Alerts</Label>
          <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
        </div>
        <Button className="w-full">Save Preferences</Button>
      </div>
    </Card>
  );
}
