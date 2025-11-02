import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logAdminAction } from '@/lib/auditLogger';
import { useToast } from '@/hooks/use-toast';

const ServicesTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState([
    { id: '1', name: 'Data Purchase', charge: 2, discount: 5, active: true },
    { id: '2', name: 'Airtime Top-up', charge: 1.5, discount: 3, active: true },
    { id: '3', name: 'Cable TV', charge: 3, discount: 0, active: true },
    { id: '4', name: 'Electricity', charge: 2.5, discount: 2, active: false },
  ]);

  const toggleService = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    const newActive = !service.active;

    // Log the admin action
    await logAdminAction({
      action: 'service_status_change',
      resource_type: 'service',
      resource_id: id,
      details: `${newActive ? 'Activated' : 'Deactivated'} service: ${service.name}`,
      before_value: { ...service, active: service.active },
      after_value: { ...service, active: newActive }
    });

    setServices(prev => prev.map(s => s.id === id ? { ...s, active: newActive } : s));
    
    toast({
      title: 'Service Updated',
      description: `${service.name} has been ${newActive ? 'activated' : 'deactivated'}.`
    });
  };

  const updateService = async (id: string, charge: number, discount: number) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    // Log the admin action
    await logAdminAction({
      action: 'service_settings_update',
      resource_type: 'service',
      resource_id: id,
      details: `Updated pricing for ${service.name}: charge ${service.charge}% → ${charge}%, discount ${service.discount}% → ${discount}%`,
      before_value: { name: service.name, charge: service.charge, discount: service.discount },
      after_value: { name: service.name, charge, discount }
    });

    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, charge, discount } : s
    ));

    toast({
      title: 'Service Settings Updated',
      description: `Pricing for ${service.name} has been updated successfully.`
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
              <button
                onClick={() => toggleService(service.id)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  service.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {service.active ? 'Active' : 'Inactive'}
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Charge (%)</label>
                <input
                  type="number"
                  value={service.charge}
                  onChange={(e) => setServices(prev => prev.map(s => 
                    s.id === service.id ? { ...s, charge: parseFloat(e.target.value) } : s
                  ))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={service.discount}
                  onChange={(e) => setServices(prev => prev.map(s => 
                    s.id === service.id ? { ...s, discount: parseFloat(e.target.value) } : s
                  ))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <button 
                onClick={() => updateService(service.id, service.charge, service.discount)}
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 font-semibold"
              >
                Update Settings
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
