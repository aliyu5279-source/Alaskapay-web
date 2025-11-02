import React from 'react';
import { Home, Users, CreditCard, BarChart3, Menu } from 'lucide-react';

interface MobileAdminNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onMenuClick: () => void;
}

const MobileAdminNav: React.FC<MobileAdminNavProps> = ({ activeTab, setActiveTab, onMenuClick }) => {
  const quickActions = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'transactions', icon: CreditCard, label: 'Payments' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => setActiveTab(action.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                activeTab === action.id ? 'text-teal-400' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{action.label}</span>
            </button>
          );
        })}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-400"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default MobileAdminNav;
