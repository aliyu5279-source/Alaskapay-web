import React, { useState } from 'react';
import { Smartphone, Wallet, Send, CreditCard, FileText, Shield, Bell, Download, Apple, Play } from 'lucide-react';

const MobileAppPreview: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState(0);

  const screens = [
    {
      title: 'Wallet Dashboard',
      description: 'View your balance and quick actions',
      image: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760106072346_3d10ca55.webp'
    },
    {
      title: 'Send Money',
      description: 'Transfer funds instantly',
      image: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760106074215_d305d88b.webp'
    },
    {
      title: 'Transaction History',
      description: 'Track all your payments',
      image: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760106075166_71a046e6.webp'
    },
    {
      title: 'Virtual Cards',
      description: 'Create and manage digital cards',
      image: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760106076242_748209b7.webp'
    },
    {
      title: 'Bill Payments',
      description: 'Pay utilities with ease',
      image: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760106083627_e78cd487.webp'
    },
    {
      title: 'Profile & Settings',
      description: 'Manage your account securely',
      image: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760106084576_f7d515c5.webp'
    }
  ];

  const features = [
    { icon: Wallet, title: 'Digital Wallet', desc: 'Secure money management' },
    { icon: Send, title: 'Instant Transfers', desc: 'Send money in seconds' },
    { icon: CreditCard, title: 'Virtual Cards', desc: 'Create cards on demand' },
    { icon: FileText, title: 'Bill Payments', desc: 'Pay all your bills' },
    { icon: Shield, title: 'Bank-Level Security', desc: 'Biometric & 2FA' },
    { icon: Bell, title: 'Real-Time Alerts', desc: 'Stay informed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Smartphone className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Alaska Pay Mobile App</h1>
          <p className="text-xl mb-8 text-blue-100">Your complete financial companion on iOS & Android</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="bg-black text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition">
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </button>
            <button className="bg-black text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition">
              <Play className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Screen Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Experience Modern Banking</h2>
            <p className="text-lg text-gray-600 mb-8">
              Alaska Pay brings you a seamless mobile banking experience with cutting-edge features
              designed for the modern user.
            </p>
            
            <div className="space-y-4">
              {screens.map((screen, index) => (
                <button
                  key={index}
                  onClick={() => setActiveScreen(index)}
                  className={`w-full text-left p-4 rounded-xl transition ${
                    activeScreen === index
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-lg">{screen.title}</div>
                  <div className={`text-sm ${activeScreen === index ? 'text-blue-100' : 'text-gray-500'}`}>
                    {screen.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-[3rem] blur-2xl opacity-20"></div>
              <img
                src={screens[activeScreen].image}
                alt={screens[activeScreen].title}
                className="relative w-80 h-auto rounded-[3rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-blue-50 transition">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Download className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Download Alaska Pay today and experience the future of mobile banking
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition">
              Download for iOS
            </button>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition">
              Download for Android
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPreview;
