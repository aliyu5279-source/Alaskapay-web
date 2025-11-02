import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { sendSecurityAlert, getDeviceInfo, getApproximateLocation } from '@/lib/emailService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Create session tracking when user logs in
      if (session?.user) {
        createSessionTracking(session.user.id, session.access_token);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Track session on auth state change
      if (_event === 'SIGNED_IN' && session?.user) {
        createSessionTracking(session.user.id, session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createSessionTracking = async (userId: string, sessionToken: string) => {
    try {
      localStorage.setItem('session_token', sessionToken);
      
      await supabase.functions.invoke('create-session', {
        body: {
          userId,
          sessionToken,
          userAgent: navigator.userAgent,
          ipAddress: 'client' // IP will be detected server-side
        }
      });

      // Log login activity
      await logActivity(userId, 'login', { description: 'User logged in successfully' });
      
      // Send new device login alert
      const device = getDeviceInfo();
      const location = await getApproximateLocation();
      await sendSecurityAlert(userId, 'new_device_login', {
        device,
        location,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating session tracking:', error);
    }
  };


  const logActivity = async (userId: string, actionType: string, actionDetails: any) => {
    try {
      await supabase.functions.invoke('log-activity', {
        body: {
          userId,
          actionType,
          actionDetails,
          deviceInfo: navigator.userAgent,
          location: 'Unknown' // Can be enhanced with geolocation API
        }
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };



  const signUp = async (email: string, password: string, fullName: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
  };


  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (user) {
      await logActivity(user.id, 'logout', { description: 'User logged out' });
    }
    await supabase.auth.signOut();
  };


  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    const result = await supabase.from('profiles').update(data).eq('id', user.id);
    
    if (!result.error) {
      await logActivity(user.id, 'profile', { description: 'Profile information updated' });
    }
    
    return result;
  };


  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
