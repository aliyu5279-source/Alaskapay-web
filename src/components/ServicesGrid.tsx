import React, { useState } from 'react';
import ServiceCard from './ServiceCard';
import TransactionModal from './TransactionModal';

const ServicesGrid: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({ type: '', name: '' });

  const services = [
    { id: '1', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640688128_387cb690.webp', title: 'Data Bundles', description: 'Affordable data for all networks', type: 'data' },
    { id: '2', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640690246_989dc333.webp', title: 'Airtime Top-up', description: 'Quick recharge for all networks', type: 'airtime' },
    { id: '3', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640688818_ce23f040.webp', title: 'Cable TV', description: 'DSTV, GOTV, Startimes', type: 'cable' },
    { id: '4', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640689518_dcbaa3a4.webp', title: 'Electricity', description: 'Pay utility bills instantly', type: 'electricity' },
    { id: '5', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640698793_9ee4c5bd.webp', title: 'Naira Card', description: 'Secure online transactions', type: 'card' },
    { id: '6', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640699572_c3faaab8.webp', title: 'Bulk SMS', description: 'Reliable messaging services', type: 'sms' },
    { id: '7', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640700277_68627429.webp', title: 'Airtime to Cash', description: 'Convert airtime instantly', type: 'airtime2cash' },
    { id: '8', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640701014_64f7c307.webp', title: 'Exam Payments', description: 'WAEC & NECO payments', type: 'exam' },
    { id: '9', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640708592_4ebb2c84.webp', title: 'Water Bills', description: 'Pay water bills easily', type: 'water' },
    { id: '10', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640701730_f19cfeb7.webp', title: 'Wallet Transfer', description: 'Send & receive money', type: 'wallet' },
    { id: '11', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640707778_14afa1ef.webp', title: 'API Integration', description: 'Developer tools & docs', type: 'api' },
    { id: '12', icon: 'https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1759640709292_7926df0c.webp', title: 'Admin Panel', description: 'Manage your business', type: 'admin' },
  ];

  const handleServiceClick = (service: any) => {
    if (service.type === 'admin') {
      window.location.href = '/admin';
    } else {
      setSelectedService({ type: service.type, name: service.title });
      setModalOpen(true);
    }
  };

  return (
    <div id="services" className="py-16 bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Everything you need for seamless digital payments</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceType={selectedService.type}
        serviceName={selectedService.name}
      />
    </div>
  );
};

export default ServicesGrid;
