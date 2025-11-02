import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, TrendingUp, ArrowRight } from 'lucide-react';

interface LimitUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  currentTier: 'basic' | 'enhanced' | 'full';
  onUpgrade: () => void;
}

const tiers = [
  {
    level: 'basic',
    name: 'Tier 1 - Basic',
    dailyLimit: '₦50,000',
    monthlyLimit: '₦1,000,000',
    perTransaction: '₦10,000',
    icon: Shield,
    color: 'text-blue-600',
    features: ['Basic verification', 'BVN verification', 'Email & Phone verified']
  },
  {
    level: 'enhanced',
    name: 'Tier 2 - Enhanced',
    dailyLimit: '₦500,000',
    monthlyLimit: '₦10,000,000',
    perTransaction: '₦100,000',
    icon: TrendingUp,
    color: 'text-purple-600',
    features: ['Enhanced verification', 'ID card upload', 'Address verification', 'Selfie verification']
  },
  {
    level: 'full',
    name: 'Tier 3 - Full',
    dailyLimit: 'Unlimited',
    monthlyLimit: 'Unlimited',
    perTransaction: 'Unlimited',
    icon: CheckCircle,
    color: 'text-green-600',
    features: ['Full verification', 'Business documents', 'Utility bill', 'Video KYC', 'No limits']
  }
];

export function LimitUpgradeModal({ open, onClose, currentTier, onUpgrade }: LimitUpgradeModalProps) {
  const currentIndex = tiers.findIndex(t => t.level === currentTier);
  const availableUpgrades = tiers.slice(currentIndex + 1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upgrade Your Transaction Limits</DialogTitle>
          <DialogDescription>
            Complete higher KYC verification to increase your transaction limits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {availableUpgrades.map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.level} className="border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${tier.color}`} />
                    <div>
                      <h3 className="font-semibold text-lg">{tier.name}</h3>
                      <Badge variant="outline" className="mt-1">Recommended</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Daily Limit</p>
                    <p className="font-semibold">{tier.dailyLimit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Limit</p>
                    <p className="font-semibold">{tier.monthlyLimit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Per Transaction</p>
                    <p className="font-semibold">{tier.perTransaction}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button onClick={onUpgrade} className="w-full">
                  Upgrade to {tier.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
