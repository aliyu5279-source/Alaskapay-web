import React from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download, Calendar, GitCompare } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnalyticsFilters {
  datePreset: string;
  compareEnabled: boolean;
  userSegments: string[];
  paymentTypes: string[];
  emailCampaigns: string[];
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  onExport: () => void;
}

const userSegmentOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'premium', label: 'Premium Users' },
  { value: 'free', label: 'Free Users' },
  { value: 'trial', label: 'Trial Users' },
  { value: 'churned', label: 'Churned Users' },
];

const paymentTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'card', label: 'Card Payments' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'wallet', label: 'Wallet' },
];

const emailCampaignOptions = [
  { value: 'all', label: 'All Campaigns' },
  { value: 'welcome', label: 'Welcome Series' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'digest', label: 'Digest Emails' },
  { value: 'transactional', label: 'Transactional' },
];

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ filters, onFiltersChange, onExport }) => {
  const [segmentOpen, setSegmentOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [campaignOpen, setCampaignOpen] = React.useState(false);

  const toggleSegment = (value: string) => {
    const newSegments = filters.userSegments.includes(value)
      ? filters.userSegments.filter(s => s !== value)
      : [...filters.userSegments, value];
    onFiltersChange({ ...filters, userSegments: newSegments });
  };

  const togglePaymentType = (value: string) => {
    const newTypes = filters.paymentTypes.includes(value)
      ? filters.paymentTypes.filter(t => t !== value)
      : [...filters.paymentTypes, value];
    onFiltersChange({ ...filters, paymentTypes: newTypes });
  };

  const toggleCampaign = (value: string) => {
    const newCampaigns = filters.emailCampaigns.includes(value)
      ? filters.emailCampaigns.filter(c => c !== value)
      : [...filters.emailCampaigns, value];
    onFiltersChange({ ...filters, emailCampaigns: newCampaigns });
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Select 
              value={filters.datePreset} 
              onValueChange={(value) => onFiltersChange({ ...filters, datePreset: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={filters.compareEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onFiltersChange({ ...filters, compareEnabled: !filters.compareEnabled })}
            className="gap-2"
          >
            <GitCompare className="h-4 w-4" />
            Compare Periods
          </Button>

          <Popover open={segmentOpen} onOpenChange={setSegmentOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                User Segments
                {filters.userSegments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{filters.userSegments.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search segments..." />
                <CommandEmpty>No segment found.</CommandEmpty>
                <CommandGroup>
                  {userSegmentOptions.map((option) => (
                    <CommandItem key={option.value} onSelect={() => toggleSegment(option.value)}>
                      <Check className={cn("mr-2 h-4 w-4", filters.userSegments.includes(option.value) ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={paymentOpen} onOpenChange={setPaymentOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Payment Types
                {filters.paymentTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{filters.paymentTypes.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search types..." />
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup>
                  {paymentTypeOptions.map((option) => (
                    <CommandItem key={option.value} onSelect={() => togglePaymentType(option.value)}>
                      <Check className={cn("mr-2 h-4 w-4", filters.paymentTypes.includes(option.value) ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={campaignOpen} onOpenChange={setCampaignOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Email Campaigns
                {filters.emailCampaigns.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{filters.emailCampaigns.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search campaigns..." />
                <CommandEmpty>No campaign found.</CommandEmpty>
                <CommandGroup>
                  {emailCampaignOptions.map((option) => (
                    <CommandItem key={option.value} onSelect={() => toggleCampaign(option.value)}>
                      <Check className={cn("mr-2 h-4 w-4", filters.emailCampaigns.includes(option.value) ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button onClick={onExport} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
