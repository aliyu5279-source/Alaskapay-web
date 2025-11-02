import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateBackupModalProps {
  onClose: () => void;
  onCreate: (type: string) => void;
}

export function CreateBackupModal({ onClose, onCreate }: CreateBackupModalProps) {
  const [backupType, setBackupType] = useState('full');
  const [includeTables, setIncludeTables] = useState<string[]>([]);

  const tables = ['users', 'transactions', 'wallets', 'payment_methods', 'kyc_submissions'];

  const handleCreate = () => {
    onCreate(backupType);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Backup</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Backup Type</Label>
            <RadioGroup value={backupType} onValueChange={setBackupType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full">Full Backup</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="incremental" id="incremental" />
                <Label htmlFor="incremental">Incremental Backup</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="differential" id="differential" />
                <Label htmlFor="differential">Differential Backup</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Tables to Include (optional)</Label>
            <div className="space-y-2 mt-2">
              {tables.map((table) => (
                <div key={table} className="flex items-center space-x-2">
                  <Checkbox
                    id={table}
                    checked={includeTables.includes(table)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIncludeTables([...includeTables, table]);
                      } else {
                        setIncludeTables(includeTables.filter(t => t !== table));
                      }
                    }}
                  />
                  <Label htmlFor={table}>{table}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCreate}>Create Backup</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
