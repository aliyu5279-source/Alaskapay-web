import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Shield } from 'lucide-react';

export function ChangeEmailForm() {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = 'Unknown Device';
    if (/mobile/i.test(ua)) device = 'Mobile Device';
    else if (/tablet/i.test(ua)) device = 'Tablet';
    else device = 'Desktop Computer';
    return `${device} - ${navigator.platform}`;
  };

  const getIPAddress = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEmail || !password) return;

    setLoading(true);
    setMessage(null);

    try {
      // Verify password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password
      });

      if (signInError) throw new Error('Invalid password');

      const ipAddress = await getIPAddress();
      const device = getDeviceInfo();
      const timestamp = Date.now();
      
      // Create verification token
      const token = btoa(`${user.id}:${newEmail}:${timestamp}`);
      const confirmationLink = `${window.location.origin}/verify-email?token=${token}`;

      const metadata = {
        oldEmail: user.email,
        newEmail,
        device,
        ipAddress,
        location: 'Nigeria',
        timestamp: new Date().toISOString(),
        confirmationLink
      };

      // Send alert to OLD email
      await supabase.functions.invoke('send-security-alert', {
        body: { userId: user.id, alertType: 'email_change_old', metadata }
      });

      // Send verification to NEW email (custom call)
      const SENDGRID_KEY = 'SG.your-key-here';
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SENDGRID_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: newEmail }] }],
          from: { email: 'noreply@alaskapay.com', name: 'Alaska Pay' },
          subject: '✉️ Verify Your New Email',
          content: [{ type: 'text/html', value: `<p>Click to verify: <a href="${confirmationLink}">Verify Email</a></p>` }]
        })
      });

      setMessage({ type: 'success', text: 'Verification emails sent! Check both inboxes.' });
      setNewEmail('');
      setPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Shield className="h-4 w-4" />
        <span>Current: {user?.email}</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newEmail">New Email Address</Label>
        <Input id="newEmail" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Confirm Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><Mail className="mr-2 h-4 w-4" /> Change Email</>}
      </Button>
    </form>
  );
}
