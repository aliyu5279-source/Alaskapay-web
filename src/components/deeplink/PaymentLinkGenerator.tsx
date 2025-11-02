import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deepLinkService } from '@/services/deepLinkService';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2 } from 'lucide-react';

export function PaymentLinkGenerator() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const { toast } = useToast();

  const generateLink = () => {
    if (!amount) {
      toast({
        title: 'Error',
        description: 'Please enter an amount',
        variant: 'destructive'
      });
      return;
    }

    const link = deepLinkService.generateLink({
      type: 'payment',
      action: 'request',
      params: {
        amount,
        description: description || 'Payment Request',
        timestamp: Date.now().toString()
      }
    });

    setGeneratedLink(link);
    toast({
      title: 'Link Generated',
      description: 'Payment link created successfully'
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: 'Copied',
      description: 'Link copied to clipboard'
    });
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AlaskaPay Payment Request',
          text: description || 'Payment Request',
          url: generatedLink
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      copyLink();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Payment Link</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this payment for?"
          />
        </div>
        <Button onClick={generateLink} className="w-full">
          Generate Link
        </Button>

        {generatedLink && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Generated Link:</p>
            <p className="text-xs break-all text-muted-foreground">
              {generatedLink}
            </p>
            <div className="flex gap-2">
              <Button onClick={copyLink} variant="outline" size="sm" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={shareLink} variant="outline" size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
