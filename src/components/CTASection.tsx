import React from 'react';

const CTASection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-teal-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of satisfied users and experience seamless digital payments today
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-white text-blue-900 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-lg">
            Create Free Account
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-all">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
