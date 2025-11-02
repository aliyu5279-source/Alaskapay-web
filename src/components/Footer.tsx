import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1761336468994_6111303b.webp" 
                alt="AlaskaPay Logo" 
                className="h-12 w-12 object-contain"
              />
              <h3 className="text-2xl font-bold text-teal-400">AlaskaPay</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Nigeria's leading digital payment platform by Alaska Mega Plus Nigeria Ltd. Fast, secure, and affordable financial solutions for everyone.
            </p>


            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Data Bundles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Airtime Top-up</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cable TV</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Electricity Bills</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bulk SMS</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); window.location.hash = 'about'; }} className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); window.location.hash = 'contact'; }} className="hover:text-white transition-colors">Contact</a></li>

              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Become a Reseller</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>

              <li className="text-gray-400">alaskapaynotification@gmail.com</li>
              <li className="text-gray-400">+234 901 576 5610</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Alaska Mega Plus Nigeria Ltd. All rights reserved. | Regulated by CBN</p>
          <p className="text-sm mt-2">100 Suleiman Barau Road, Opposite FIRS, Suleja, Niger State | RC: 7351158</p>



        </div>
      </div>
    </footer>
  );
};

export default Footer;
