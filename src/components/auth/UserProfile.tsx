import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TwoFactorSettings } from '@/components/TwoFactorSettings';
import { SessionManagement } from '@/components/SessionManagement';
import { SessionSettings } from '@/components/SessionSettings';
import { ActivityLog } from '@/components/ActivityLog';
import NotificationPreferences from '@/components/NotificationPreferences';
import NotificationPanel from '@/components/NotificationPanel';
import { ChangePasswordForm } from '@/components/ChangePasswordForm';
import { ChangeEmailForm } from '@/components/ChangeEmailForm';
import { ChangePhoneNumberForm } from './ChangePhoneNumberForm';
import { BiometricSettings } from '@/components/BiometricSettings';
import ChangePINModal from '@/components/pin/ChangePINModal';
import PINSetupModal from '@/components/pin/PINSetupModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react';


export const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [pinSet, setPinSet] = useState(false);
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [showSetupPIN, setShowSetupPIN] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setFullName(data.full_name || '');
            setPhone(data.phone || '');
            setPhoneVerified(data.phone_verified || false);
            setPinSet(data.pin_set || false);
          }
        });
    }
  }, [user]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await updateProfile({ full_name: fullName, updated_at: new Date().toISOString() });
    setLoading(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Profile updated successfully!' });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Wallet Account)</Label>
                  <div className="flex gap-2 items-center">
                    <Input id="phone" value={phone} disabled />
                    {phoneVerified && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChangePhone(!showChangePhone)}
                    className="mt-2"
                  >
                    Change Phone Number
                  </Button>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {showChangePhone && user && (
            <ChangePhoneNumberForm
              currentPhone={phone}
              userId={user.id}
              onSuccess={() => {
                setShowChangePhone(false);
                window.location.reload();
              }}
            />
          )}
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Transaction PIN
              </CardTitle>
              <CardDescription>Manage your transaction PIN for wallet operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Transaction PIN Status:</span>
                  {pinSet ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Set
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not Set</Badge>
                  )}
                </div>
              </div>
              {pinSet ? (
                <Button onClick={() => setShowChangePIN(true)} variant="outline">
                  Change PIN
                </Button>
              ) : (
                <Button onClick={() => setShowSetupPIN(true)}>
                  Set Up PIN
                </Button>
              )}
            </CardContent>
          </Card>
          
          <BiometricSettings />
          <ChangePasswordForm />
          <ChangeEmailForm />
          <TwoFactorSettings />
        </TabsContent>


        <TabsContent value="sessions" className="space-y-6">
          <SessionManagement />
          <SessionSettings />
        </TabsContent>

        <TabsContent value="activity">
          {user && <ActivityLog userId={user.id} />}
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPanel />
        </TabsContent>

        <TabsContent value="preferences">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
      
      <ChangePINModal open={showChangePIN} onOpenChange={setShowChangePIN} />
      <PINSetupModal open={showSetupPIN} onOpenChange={setShowSetupPIN} onSuccess={() => { setPinSet(true); setShowSetupPIN(false); }} />
    </div>
  );
};

