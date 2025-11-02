import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download } from 'lucide-react';

interface VerifyBackupModalProps {
  backup: any;
  onClose: () => void;
}

export function VerifyBackupModal({ backup, onClose }: VerifyBackupModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backup Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="font-medium">{backup.backup_type}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge>{backup.status}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Size</div>
              <div className="font-medium">
                {backup.backup_size_bytes 
                  ? `${(backup.backup_size_bytes / 1024 / 1024).toFixed(2)} MB`
                  : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium">
                {new Date(backup.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          {backup.checksum && (
            <div>
              <div className="text-sm text-muted-foreground">Checksum</div>
              <div className="font-mono text-xs break-all">{backup.checksum}</div>
            </div>
          )}

          {backup.backup_location && (
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="text-sm">{backup.backup_location}</div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
