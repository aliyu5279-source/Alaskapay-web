import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from './CurrencyDisplay';

interface LimitWarningModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onProceed?: () => void;
  kycLevel: string;
  dailyLimit: number;
  currentUsage: number;
  requestedAmount: number;
  canProceed: boolean;
}

const nextLevel = {
  none: { level: 'Basic', limit: 1000 },
  basic: { level: 'Enhanced', limit: 10000 },
  enhanced: { level: 'Full', limit: 'Unlimited' }
};

export function LimitWarningModal({
  open,
  onClose,
  onUpgrade,
  onProceed,
  kycLevel,
  dailyLimit,
  currentUsage,
  requestedAmount,
  canProceed
}: LimitWarningModalProps) {
  const next = nextLevel[kycLevel as keyof typeof nextLevel];
  const remaining = dailyLimit - currentUsage;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {canProceed ? 'Transaction Limit Warning' : 'Transaction Limit Exceeded'}
          </DialogTitle>
          <DialogDescription>
            {canProceed
              ? 'This transaction will use most of your daily limit.'
              : 'This transaction exceeds your daily limit.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant={canProceed ? 'default' : 'destructive'}>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transaction Amount:</span>
                  <span className="font-semibold">
                    <CurrencyDisplay amount={requestedAmount} showCode={false} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Usage:</span>
                  <span>
                    <CurrencyDisplay amount={currentUsage} showCode={false} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Limit:</span>
                  <span>
                    <CurrencyDisplay amount={dailyLimit} showCode={false} />
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Remaining:</span>
                  <span className={remaining < 0 ? 'text-red-500 font-semibold' : 'font-semibold'}>
                    <CurrencyDisplay amount={remaining} showCode={false} />
                  </span>
                </div>
              </div>

            </AlertDescription>
          </Alert>

          {next && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold">Upgrade Available</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Upgrade to <Badge variant="outline">{next.level}</Badge> verification for{' '}
                {typeof next.limit === 'number' ? (
                  <CurrencyDisplay amount={next.limit} showCode={false} />
                ) : (
                  next.limit
                )}{' '}
                daily limit
              </p>
            </div>
          )}
        </div>


        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {next && (
            <Button onClick={onUpgrade}>
              Upgrade Verification
            </Button>
          )}
          {canProceed && onProceed && (
            <Button onClick={onProceed} variant="default">
              Proceed Anyway
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
