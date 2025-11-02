import { useEffect, useCallback } from 'react';
import { crashReporting } from '@/lib/crashReporting';
import { useAuth } from '@/contexts/AuthContext';

export function useCrashReporting() {
  const { user } = useAuth();

  // Set user context when user changes
  useEffect(() => {
    if (user) {
      crashReporting.setUser(user.id, user.email);
    } else {
      crashReporting.clearUser();
    }
  }, [user]);

  const logError = useCallback((error: Error, context?: Record<string, any>) => {
    crashReporting.logError(error, {
      ...context,
      screen: window.location.pathname,
    });
  }, []);

  const logMessage = useCallback(
    (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
      crashReporting.logMessage(message, level);
    },
    []
  );

  const recordBreadcrumb = useCallback((message: string, data?: any) => {
    crashReporting.recordBreadcrumb(message, data);
  }, []);

  return {
    logError,
    logMessage,
    recordBreadcrumb,
  };
}
