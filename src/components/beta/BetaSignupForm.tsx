import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Apple, Smartphone } from 'lucide-react';

export function BetaSignupForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    platform: '',
    device_model: '',
    os_version: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('beta_testers').insert({
        ...formData,
        status: 'pending',
        group: 'beta-users'
      });

      if (error) throw error;

      toast.success('Application submitted! Check your email for next steps.');
      setFormData({ full_name: '', email: '', platform: '', device_model: '', os_version: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Beta Testing</CardTitle>
        <CardDescription>Get early access to new features</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={formData.platform} onValueChange={(v) => setFormData({...formData, platform: v})}>
              <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ios"><Apple className="h-4 w-4 inline mr-2" />iOS</SelectItem>
                <SelectItem value="android"><Smartphone className="h-4 w-4 inline mr-2" />Android</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Device Model</Label>
            <Input placeholder="e.g., iPhone 14 Pro" value={formData.device_model} onChange={(e) => setFormData({...formData, device_model: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>OS Version</Label>
            <Input placeholder="e.g., iOS 17.2" value={formData.os_version} onChange={(e) => setFormData({...formData, os_version: e.target.value})} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Apply for Beta Access'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
