import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Shield, CheckCircle, ArrowUpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TransactionLimitCardProps {
  kycLevel: 'none' | 'basic' | 'enhanced' | 'full';
  dailyLimit: number;
  currentUsage: number;
  onUpgradeClick: () => void;
}

const levelConfig = {
  none: { label: 'Unverified', color: 'bg-gray-500', icon: AlertCircle, limit: 0 },
  basic: { label: 'Tier 1 - Basic', color: 'bg-blue-500', icon: Shield, limit: 50000 },
  enhanced: { label: 'Tier 2 - Enhanced', color: 'bg-purple-500', icon: TrendingUp, limit: 500000 },
  full: { label: 'Tier 3 - Full', color: 'bg-green-500', icon: CheckCircle, limit: 999999999 }
};

export function TransactionLimitCard({ kycLevel, dailyLimit, currentUsage, onUpgradeClick }: TransactionLimitCardProps) {
  const config = levelConfig[kycLevel];
  const Icon = config.icon;
  const percentUsed = dailyLimit > 0 ? (currentUsage / dailyLimit) * 100 : 0;
  const remaining = dailyLimit - currentUsage;
  const isNearLimit = percentUsed >= 80;
  const isAtLimit = percentUsed >= 100;
  const isUnlimited = dailyLimit >= 999999999;

  const formatAmount = (amount: number) => {
    if (amount >= 999999999) return '∞';
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              Daily Transaction Limit
            </CardTitle>
            <CardDescription>Based on your KYC verification</CardDescription>
          </div>
          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Used Today</span>
            <span className="font-semibold">
              {formatAmount(currentUsage)} / {formatAmount(dailyLimit)}
            </span>
          </div>
          <Progress value={Math.min(percentUsed, 100)} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{percentUsed.toFixed(1)}% used</span>
            {!isUnlimited && <span>{formatAmount(remaining)} remaining</span>}
          </div>
        </div>

        {isAtLimit && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Daily limit reached. Upgrade your KYC tier to increase limits.
            </AlertDescription>
          </Alert>
        )}

        {isNearLimit && !isAtLimit && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've used {percentUsed.toFixed(0)}% of your daily limit. {formatAmount(remaining)} remaining.
            </AlertDescription>
          </Alert>
        )}

        {kycLevel !== 'full' && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {kycLevel === 'basic' && 'Upgrade to Tier 2 for ₦500,000/day limit'}
              {kycLevel === 'enhanced' && 'Upgrade to Tier 3 for unlimited transactions'}
            </p>
            <Button onClick={onUpgradeClick} className="w-full" size="sm">
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Upgrade KYC Tier
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

