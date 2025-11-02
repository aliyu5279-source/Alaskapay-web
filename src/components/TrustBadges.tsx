import React from 'react';
import { Shield, Lock, Zap, Users } from 'lucide-react';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption'
    },
    {
      icon: Lock,
      title: 'Licensed & Regulated',
      description: 'CBN approved platform'
    },
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Real-time processing'
    },
    {
      icon: Users,
      title: '100,000+ Users',
      description: 'Trusted by Nigerians'
    }
  ];

  return (
    <div className="bg-white py-12 border-t border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <badge.icon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
