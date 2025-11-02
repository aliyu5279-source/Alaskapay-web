import React from 'react';

const DashboardTab: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '12,450', change: '+12%', color: 'blue' },
    { label: 'Pending Transactions', value: '234', change: '+5%', color: 'yellow' },
    { label: 'Revenue (Today)', value: '₦2.4M', change: '+18%', color: 'green' },
    { label: 'Active Services', value: '12', change: '0%', color: 'teal' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className={`text-sm font-semibold text-${stat.color}-600`}>{stat.change} from yesterday</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">New user registration</p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
                <span className="text-green-600 font-semibold">+1</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Service Performance</h3>
          <div className="space-y-4">
            {['Data Purchase', 'Airtime', 'Cable TV', 'Electricity'].map((service, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{service}</span>
                  <span className="text-sm font-semibold text-gray-900">{85 - i * 10}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${85 - i * 10}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
