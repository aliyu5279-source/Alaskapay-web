import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FeedbackData {
  feedback: string;
  category?: 'bug' | 'feature' | 'improvement' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  screenshot_url?: string;
}

export function useBetaFeedback() {
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async (data: FeedbackData) => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get app version from package.json or environment
      const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
      
      // Get device info
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        online: navigator.onLine
      };

      // Determine platform
      const platform = /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android';

      const { error } = await supabase.from('beta_feedback').insert({
        user_id: user.id,
        feedback: data.feedback,
        category: data.category || 'other',
        priority: data.priority || 'medium',
        screenshot_url: data.screenshot_url,
        app_version: appVersion,
        device_info: deviceInfo,
        platform,
        status: 'new'
      });

      if (error) throw error;

      // Track analytics event
      await supabase.from('beta_analytics').insert({
        user_id: user.id,
        event_name: 'feedback_submitted',
        properties: { category: data.category, priority: data.priority },
        app_version: appVersion,
        platform,
        device_info: deviceInfo
      });

      toast.success('Thank you for your feedback!');
      return true;
    } catch (error: any) {
      toast.error('Failed to submit feedback');
      console.error('Feedback submission error:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const uploadScreenshot = async (file: File): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('beta-screenshots')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('beta-screenshots')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Screenshot upload error:', error);
      return null;
    }
  };

  return {
    submitFeedback,
    uploadScreenshot,
    submitting
  };
}
