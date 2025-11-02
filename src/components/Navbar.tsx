import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import NotificationPanel from './NotificationPanel';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user: appUser } = useApp();
  const { user: authUser, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();
        
        setIsAdmin(data?.role === 'admin' || data?.role === 'super_admin');
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [authUser]);

  const handleSignOut = async () => {
    await signOut();
    window.location.hash = '';
    window.location.href = '/';
  };


  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1761336468994_6111303b.webp" 
              alt="AlaskaPay Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-blue-900">AlaskaPay</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-900 font-medium">Home</a>
            <a href="#services" className="text-gray-700 hover:text-blue-900 font-medium">Services</a>
            <a href="#mobile" onClick={(e) => { e.preventDefault(); window.location.hash = 'mobile'; }} className="text-gray-700 hover:text-blue-900 font-medium">Mobile App</a>
            <a href="#payments" onClick={(e) => { e.preventDefault(); window.location.hash = 'payments'; }} className="text-gray-700 hover:text-blue-900 font-medium">Payments</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); window.location.hash = 'about'; }} className="text-gray-700 hover:text-blue-900 font-medium">About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); window.location.hash = 'contact'; }} className="text-gray-700 hover:text-blue-900 font-medium">Contact</a>
          </div>



          <div className="flex items-center gap-3">
            {authUser ? (
              <>
                <VerificationStatusBadge />
                <NotificationPanel />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 focus:outline-none">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">{authUser.email}</p>
                        {appUser && <p className="text-xs text-gray-600">₦{appUser.balance.toLocaleString()}</p>}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                        {authUser.email?.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.hash = 'profile'}>
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.hash = 'dashboard'}>
                      Dashboard
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.location.href = '/admin'}>
                          Admin Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.hash = 'auth'} 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => window.location.hash = 'auth'} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-md"
                >
                  Sign Up
                </Button>
              </div>
            )}


            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a href="#" className="block text-gray-700 hover:text-blue-900 font-medium">Home</a>
            <a href="#services" className="block text-gray-700 hover:text-blue-900 font-medium">Services</a>
            <a href="#mobile" onClick={(e) => { e.preventDefault(); window.location.hash = 'mobile'; setMobileMenuOpen(false); }} className="block text-gray-700 hover:text-blue-900 font-medium">Mobile App</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); window.location.hash = 'about'; setMobileMenuOpen(false); }} className="block text-gray-700 hover:text-blue-900 font-medium">About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); window.location.hash = 'contact'; setMobileMenuOpen(false); }} className="block text-gray-700 hover:text-blue-900 font-medium">Contact</a>
            
            {!authUser && (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => { window.location.hash = 'auth'; setMobileMenuOpen(false); }} 
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => { window.location.hash = 'auth'; setMobileMenuOpen(false); }} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
