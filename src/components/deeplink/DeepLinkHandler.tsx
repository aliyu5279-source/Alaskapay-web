import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deepLinkService, DeepLinkData } from '@/services/deepLinkService';
import { useToast } from '@/hooks/use-toast';

export function DeepLinkHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle initial deep link on app load
    const handleInitialLink = () => {
      const url = window.location.href;
      const linkData = deepLinkService.parseLink(url);
      
      if (linkData) {
        handleDeepLink(linkData);
      }
    };

    // Handle deep links during app runtime
    const handleRuntimeLink = (event: MessageEvent) => {
      if (event.data?.type === 'DEEP_LINK') {
        const linkData = deepLinkService.parseLink(event.data.url);
        if (linkData) {
          handleDeepLink(linkData);
        }
      }
    };

    handleInitialLink();
    window.addEventListener('message', handleRuntimeLink);

    return () => {
      window.removeEventListener('message', handleRuntimeLink);
    };
  }, []);

  const handleDeepLink = async (data: DeepLinkData) => {
    // Track analytics
    await deepLinkService.trackLink({
      link_id: `${data.type}_${Date.now()}`,
      device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'web',
      app_installed: true,
      converted: false,
      timestamp: new Date().toISOString()
    });

    // Route based on link type
    switch (data.type) {
      case 'payment':
        navigate(`/dashboard/wallet?action=pay&${new URLSearchParams(data.params)}`);
        break;
      case 'referral':
        navigate(`/dashboard?referral=${data.params.code}`);
        toast({
          title: 'Referral Applied',
          description: `Welcome! You've been referred by ${data.params.code}`
        });
        break;
      case 'transfer':
        navigate(`/dashboard/wallet?action=transfer&${new URLSearchParams(data.params)}`);
        break;
      case 'bill':
        navigate(`/dashboard/bills?${new URLSearchParams(data.params)}`);
        break;
      case 'card':
        navigate(`/dashboard/cards?${new URLSearchParams(data.params)}`);
        break;
      case 'promo':
        navigate(`/dashboard?promo=${data.params.campaign}`);
        toast({
          title: 'Promotion Available',
          description: 'Check your dashboard for exclusive offers!'
        });
        break;
      case 'kyc':
        navigate('/dashboard/profile?tab=kyc');
        break;
      case 'support':
        navigate('/dashboard/support');
        break;
    }
  };

  return null;
}
