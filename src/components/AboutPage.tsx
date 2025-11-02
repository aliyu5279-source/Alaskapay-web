import React from 'react';
import { Shield, Zap, Users, Globe, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const AboutPage: React.FC = () => {
  const values = [
    { icon: Shield, title: 'Security First', desc: 'Bank-level encryption and security protocols' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Instant transactions and real-time processing' },
    { icon: Users, title: 'Customer Focus', desc: '24/7 support and dedicated account managers' },
    { icon: Globe, title: 'Global Reach', desc: 'Multi-currency support across 50+ countries' }
  ];

  const stats = [
    { value: '500K+', label: 'Active Users' },
    { value: '$2B+', label: 'Processed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760090589019_ee29dbfa.webp)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-teal-900/90 flex items-center">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-4">About AlaskaPay</h1>
            <p className="text-xl text-white/90 max-w-2xl">Empowering businesses and individuals with seamless, secure payment solutions across Africa and beyond.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            To democratize financial services by providing accessible, reliable, and innovative payment solutions that empower individuals and businesses to thrive in the digital economy.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-12 text-white text-center">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Award-Winning Platform</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Recognized as the Best Fintech Innovation 2024 by African Tech Awards and trusted by over 500,000 users worldwide.
          </p>
          <div className="flex justify-center gap-4">
            <TrendingUp className="w-8 h-8" />
            <Shield className="w-8 h-8" />
            <Globe className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};
