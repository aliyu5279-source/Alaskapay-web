import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

interface KYCVerificationBadgeProps {
  status: 'none' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'resubmit_required';
  level?: 'none' | 'basic' | 'enhanced' | 'full';
  size?: 'sm' | 'md' | 'lg';
}

export function KYCVerificationBadge({ status, level = 'none', size = 'md' }: KYCVerificationBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: ShieldCheck,
          label: level === 'full' ? 'Fully Verified' : level === 'enhanced' ? 'Enhanced Verified' : 'Verified',
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600'
        };
      case 'under_review':
        return {
          icon: Clock,
          label: 'Under Review',
          variant: 'secondary' as const,
          className: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          variant: 'outline' as const,
          className: 'border-yellow-500 text-yellow-700'
        };
      case 'rejected':
        return {
          icon: ShieldAlert,
          label: 'Rejected',
          variant: 'destructive' as const,
          className: ''
        };
      case 'resubmit_required':
        return {
          icon: ShieldAlert,
          label: 'Resubmit Required',
          variant: 'outline' as const,
          className: 'border-orange-500 text-orange-700'
        };
      default:
        return {
          icon: Shield,
          label: 'Not Verified',
          variant: 'outline' as const,
          className: 'border-gray-400 text-gray-600'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;

  return (
    <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
      <Icon size={iconSize} />
      <span>{config.label}</span>
    </Badge>
  );
}
