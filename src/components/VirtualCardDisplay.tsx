import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualCardDisplayProps {
  card: {
    id: string;
    card_name: string;
    card_type: string;
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    card_design: string;
    status: string;
  };
}

export function VirtualCardDisplay({ card }: VirtualCardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const cardDesigns = {
    default: 'bg-gradient-to-br from-blue-600 to-blue-800',
    'gradient-blue': 'bg-gradient-to-br from-cyan-500 to-blue-600',
    'gradient-purple': 'bg-gradient-to-br from-purple-600 to-pink-600',
    'black-gold': 'bg-gradient-to-br from-gray-900 to-gray-700'
  };

  const formatCardNumber = (number: string, masked: boolean = true) => {
    if (masked) {
      return `•••• •••• •••• ${number.slice(-4)}`;
    }
    return number.match(/.{1,4}/g)?.join(' ') || number;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="perspective-1000">
      <div
        className={cn(
          "relative w-full h-52 transition-transform duration-700 transform-style-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden p-6 text-white border-0",
            cardDesigns[card.card_design as keyof typeof cardDesigns] || cardDesigns.default
          )}
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium opacity-90">{card.card_name}</div>
              <div className="text-xs px-2 py-1 bg-white/20 rounded">
                {card.card_type.toUpperCase()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-xl font-mono tracking-wider">
                  {formatCardNumber(card.card_number, !showDetails)}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                  }}
                >
                  {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-70">Valid Thru</div>
                  <div className="font-mono">{card.expiry_month}/{card.expiry_year}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold">AlaskaPay</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Back of Card */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden rotate-y-180 p-6 text-white border-0",
            cardDesigns[card.card_design as keyof typeof cardDesigns] || cardDesigns.default
          )}
        >
          <div className="flex flex-col h-full">
            <div className="h-12 bg-black/50 -mx-6 mt-4"></div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between bg-white/20 p-3 rounded">
                <div>
                  <div className="text-xs opacity-70">CVV</div>
                  <div className="font-mono text-lg">
                    {showDetails ? card.cvv : '•••'}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(card.cvv, 'cvv');
                  }}
                >
                  {copiedField === 'cvv' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="text-xs opacity-70 text-center">
                Click to flip card
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
