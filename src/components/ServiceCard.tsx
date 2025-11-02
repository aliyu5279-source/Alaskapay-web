import React from 'react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-teal-500"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <img src={icon} alt={title} className="w-12 h-12 object-contain" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
