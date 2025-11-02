import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FileText, MessageSquare, Clock, Upload } from 'lucide-react';

interface DisputeDetailModalProps {
  open: boolean;
  onClose: () => void;
  dispute: any;
}

export function DisputeDetailModal({ open, onClose, dispute }: DisputeDetailModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (dispute) {
      loadDisputeData();
    }
  }, [dispute]);

  const loadDisputeData = async () => {
    try {
      const [messagesRes, evidenceRes, auditRes] = await Promise.all([
        supabase.from('dispute_messages').select('*').eq('dispute_id', dispute.id).order('created_at'),
        supabase.from('dispute_evidence').select('*').eq('dispute_id', dispute.id),
        supabase.from('dispute_audit_logs').select('*').eq('dispute_id', dispute.id).order('created_at', { ascending: false })
      ]);

      setMessages(messagesRes.data || []);
      setEvidence(evidenceRes.data || []);
      setAuditLog(auditRes.data || []);
    } catch (error) {
      console.error('Error loading dispute data:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('dispute_messages').insert({
        dispute_id: dispute.id,
        user_id: user.id,
        message: newMessage
      });

      if (error) throw error;
      setNewMessage('');
      loadDisputeData();
      toast({ title: 'Message sent' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const uploadEvidence = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileName = `${dispute.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('dispute-evidence')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dispute-evidence')
        .getPublicUrl(fileName);

      await supabase.from('dispute_evidence').insert({
        dispute_id: dispute.id,
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size
      });

      loadDisputeData();
      toast({ title: 'Evidence uploaded' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Dispute Details</DialogTitle>
            <Badge>{dispute?.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-semibold">₦{dispute?.amount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-semibold">{dispute?.dispute_type?.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-semibold">{format(new Date(dispute?.created_at), 'PPp')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <Badge variant="outline">{dispute?.priority}</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Reason</h4>
            <p>{dispute?.reason}</p>
            {dispute?.description && (
              <p className="mt-2 text-muted-foreground">{dispute.description}</p>
            )}
          </div>

          <Tabs defaultValue="messages">
            <TabsList>
              <TabsTrigger value="messages"><MessageSquare className="w-4 h-4 mr-2" />Messages</TabsTrigger>
              <TabsTrigger value="evidence"><FileText className="w-4 h-4 mr-2" />Evidence</TabsTrigger>
              <TabsTrigger value="timeline"><Clock className="w-4 h-4 mr-2" />Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className="p-3 bg-muted rounded">
                    <p>{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(msg.created_at), 'PPp')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={2}
                />
                <Button onClick={sendMessage} disabled={loading}>Send</Button>
              </div>
            </TabsContent>

            <TabsContent value="evidence">
              <div className="space-y-2">
                {evidence.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{ev.file_name}</span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={ev.file_url} target="_blank" rel="noopener">View</a>
                    </Button>
                  </div>
                ))}
                <div>
                  <input type="file" id="evidence-upload" className="hidden" onChange={uploadEvidence} />
                  <label htmlFor="evidence-upload">
                    <Button variant="outline" asChild>
                      <span><Upload className="w-4 h-4 mr-2" />Upload Evidence</span>
                    </Button>
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="space-y-2">
                {auditLog.map(log => (
                  <div key={log.id} className="flex items-start gap-2 p-2 border-l-2 border-primary">
                    <div className="flex-1">
                      <p className="font-medium">{log.action.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
