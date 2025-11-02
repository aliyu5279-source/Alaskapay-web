import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function PhoneAccountDisplay() {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPhone = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user.id)
        .single();
      
      if (data?.phone) {
        setPhoneNumber(data.phone);
      }
    };
    fetchPhone();
  }, [user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    toast.success('Phone number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!phoneNumber) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Phone className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your Wallet Account</p>
            <p className="font-semibold text-lg">{phoneNumber}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </Card>
  );
}
