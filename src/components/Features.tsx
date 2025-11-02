import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Secure Transactions',
      description: 'Two-factor authentication and encryption to safeguard every payment'
    },
    {
      icon: '⚡',
      title: 'Instant Processing',
      description: 'Real-time transaction processing with immediate confirmations'
    },
    {
      icon: '💰',
      title: 'Affordable Rates',
      description: 'Competitive pricing with discounts on bulk transactions'
    },
    {
      icon: '📱',
      title: 'Multi-Platform',
      description: 'Access from web, mobile, and integrate via our API'
    },
    {
      icon: '🔔',
      title: 'Real-time Alerts',
      description: 'Get instant notifications for all your transactions'
    },
    {
      icon: '🎯',
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Alaska Pay?</h2>
          <p className="text-xl text-gray-600">Trusted by thousands of users across Nigeria</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
