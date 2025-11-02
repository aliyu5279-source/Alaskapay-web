import React from 'react';
import { useApp } from '../contexts/AppContext';

const WalletCard: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-blue-100 text-sm mb-1">Available Balance</p>
          <h2 className="text-4xl font-bold">₦{user?.balance.toLocaleString()}</h2>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Fund Wallet
        </button>
        <button className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors">
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default WalletCard;
