interface ErrorContext {
  userId?: string;
  screen?: string;
  action?: string;
  [key: string]: any;
}

interface CrashReportingService {
  initialize: () => Promise<void>;
  logError: (error: Error, context?: ErrorContext) => void;
  logMessage: (message: string, level?: 'info' | 'warning' | 'error') => void;
  setUser: (userId: string, email?: string) => void;
  clearUser: () => void;
  recordBreadcrumb: (message: string, data?: any) => void;
}

class CrashReporting implements CrashReportingService {
  private initialized = false;
  private breadcrumbs: Array<{ message: string; timestamp: Date; data?: any }> = [];
  private userContext: { userId?: string; email?: string } = {};

  async initialize(): Promise<void> {
    if (this.initialized) return;
    console.log('Crash reporting initialized for web');
    this.initialized = true;
  }

  logError(error: Error, context?: ErrorContext): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      breadcrumbs: this.breadcrumbs.slice(-10),
      user: this.userContext,
      platform: 'web',
      timestamp: new Date().toISOString(),
    };

    console.error('Crash Report:', errorData);
    this.sendToBackend(errorData);
  }

  logMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    console[level](`[${level.toUpperCase()}]`, message);
    this.recordBreadcrumb(message, { level });
  }

  setUser(userId: string, email?: string): void {
    this.userContext = { userId, email };
  }

  clearUser(): void {
    this.userContext = {};
  }

  recordBreadcrumb(message: string, data?: any): void {
    this.breadcrumbs.push({
      message,
      timestamp: new Date(),
      data,
    });

    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift();
    }
  }

  private async sendToBackend(errorData: any): Promise<void> {
    try {
      await fetch('/api/crash-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      });
    } catch (err) {
      console.error('Failed to send crash report:', err);
    }
  }
}

export const crashReporting = new CrashReporting();
