import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    { value: '₦50B+', label: 'Transaction Volume' },
    { value: '100K+', label: 'Active Users' },
    { value: '500K+', label: 'Monthly Transactions' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-900 to-teal-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
