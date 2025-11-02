import React, { useState, useEffect } from 'react';
import { AppProvider } from '../contexts/AppContext';
import Navbar from './Navbar';
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import Features from './Features';
import Dashboard from './Dashboard';
import CTASection from './CTASection';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';
import PaymentMethodsPage from './PaymentMethodsPage';
import { LoginForm } from './auth/LoginForm';
import { SignupForm } from './auth/SignupForm';
import { PasswordResetForm } from './auth/PasswordResetForm';
import { UserProfile } from './auth/UserProfile';
import { ProtectedRoute } from './ProtectedRoute';
import { ChatWidget } from './chat/ChatWidget';
import { ContactPage } from './ContactPage';
import { AboutPage } from './AboutPage';
import MobileAppPreview from './MobileAppPreview';
import { ErrorBoundary } from './ErrorBoundary';
import TrustBadges from './TrustBadges';
import StatsSection from './StatsSection';


const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'payments' | 'auth' | 'profile' | 'dashboard' | 'contact' | 'about' | 'mobile'>('home');
  const [authView, setAuthView] = useState<'login' | 'signup' | 'reset'>('login');

  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.slice(1);
      if (window.location.pathname.includes('/admin')) {
        setCurrentView('admin');
      } else if (hash === 'payments') {
        setCurrentView('payments');
      } else if (hash === 'auth') {
        setCurrentView('auth');
      } else if (hash === 'profile') {
        setCurrentView('profile');
      } else if (hash === 'dashboard') {
        setCurrentView('dashboard');
      } else if (hash === 'contact') {
        setCurrentView('contact');
      } else if (hash === 'about') {
        setCurrentView('about');
      } else if (hash === 'mobile') {
        setCurrentView('mobile');
      } else {
        setCurrentView('home');
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  if (currentView === 'admin') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <ProtectedRoute>
            <AdminDashboard />
            <ChatWidget />
          </ProtectedRoute>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  if (currentView === 'payments') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <PaymentMethodsPage />
              <Footer />
              <ChatWidget />
            </div>
          </ProtectedRoute>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  if (currentView === 'auth') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
            <Navbar />
            <div className="mt-20">
              {authView === 'login' && (
                <LoginForm
                  onSuccess={() => window.location.hash = ''}
                  onSwitchToSignup={() => setAuthView('signup')}
                  onSwitchToReset={() => setAuthView('reset')}
                />
              )}
              {authView === 'signup' && (
                <SignupForm
                  onSuccess={() => setAuthView('login')}
                  onSwitchToLogin={() => setAuthView('login')}
                />
              )}
              {authView === 'reset' && (
                <PasswordResetForm onBack={() => setAuthView('login')} />
              )}
            </div>
          </div>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  if (currentView === 'profile') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="py-12">
                <UserProfile />
              </div>
              <Footer />
              <ChatWidget />
            </div>
          </ProtectedRoute>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <ProtectedRoute>
            <div className="min-h-screen bg-white">
              <Navbar />
              <Dashboard />
              <Footer />
              <ChatWidget />
            </div>
          </ProtectedRoute>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  if (currentView === 'contact') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <ContactPage />
            <Footer />
            <ChatWidget />
          </div>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  if (currentView === 'about') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <AboutPage />
            <Footer />
            <ChatWidget />
          </div>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  if (currentView === 'mobile') {
    return (
      <ErrorBoundary>
        <AppProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <MobileAppPreview />
            <Footer />
          </div>
        </AppProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Hero />
          <TrustBadges />
          <ServicesGrid />
          <StatsSection />
          <Features />
          <CTASection />
          <Footer />
          <ChatWidget />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default AppLayout;
