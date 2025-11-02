import { useState, useEffect } from 'react';

export function useNativeFeatures() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');

  useEffect(() => {
    // Always web for this build
    setIsNative(false);
    setPlatform('web');
  }, []);

  const shareContent = async (data: {
    title?: string;
    text?: string;
    url?: string;
    files?: string[];
  }) => {
    // Use Web Share API
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    }
    return false;
  };

  const hapticFeedback = async (_type: 'light' | 'medium' | 'heavy' = 'medium') => {
    // No haptics on web
    return;
  };

  const saveFile = async (filename: string, data: string) => {
    // Download file
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  };

  return {
    isNative,
    platform,
    shareContent,
    hapticFeedback,
    saveFile,
  };
}
