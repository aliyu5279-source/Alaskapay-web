import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Key, MessageSquare, Shield } from 'lucide-react';
import { TOTPSetup } from './TOTPSetup';
import { WebAuthnSetup } from './WebAuthnSetup';
import { SMSSetup } from './SMSSetup';
import { BackupCodesSetup } from './BackupCodesSetup';

interface MFASetupWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function MFASetupWizard({ open, onClose, onComplete }: MFASetupWizardProps) {
  const [activeTab, setActiveTab] = useState('totp');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Set Up Multi-Factor Authentication</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="totp" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Authenticator</span>
            </TabsTrigger>
            <TabsTrigger value="webauthn" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Security Key</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">SMS</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Backup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="totp" className="mt-6">
            <TOTPSetup onComplete={onComplete} />
          </TabsContent>

          <TabsContent value="webauthn" className="mt-6">
            <WebAuthnSetup onComplete={onComplete} />
          </TabsContent>

          <TabsContent value="sms" className="mt-6">
            <SMSSetup onComplete={onComplete} />
          </TabsContent>

          <TabsContent value="backup" className="mt-6">
            <BackupCodesSetup onComplete={onComplete} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
