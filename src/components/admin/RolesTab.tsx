import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logAdminAction } from '@/lib/auditLogger';
import { useToast } from '@/hooks/use-toast';

const RolesTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [roles, setRoles] = useState([
    { id: '1', name: 'Super Admin', permissions: ['all'] },
    { id: '2', name: 'Transaction Manager', permissions: ['view_transactions', 'approve_transactions'] },
    { id: '3', name: 'User Manager', permissions: ['view_users', 'edit_users'] },
  ]);

  const allPermissions = [
    'view_users', 'edit_users', 'delete_users',
    'view_transactions', 'approve_transactions',
    'manage_services', 'manage_pricing',
    'send_notifications', 'system_settings'
  ];

  const togglePermission = (roleId: string, permission: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id !== roleId || role.permissions.includes('all')) return role;
      
      const hasPermission = role.permissions.includes(permission);
      const newPermissions = hasPermission
        ? role.permissions.filter(p => p !== permission)
        : [...role.permissions, permission];
      
      return { ...role, permissions: newPermissions };
    }));
  };

  const saveRoleChanges = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    // For demo, we'll assume the original permissions (you'd fetch from DB in production)
    const originalRole = roles.find(r => r.id === roleId);
    
    // Log the admin action
    await logAdminAction({
      action: 'role_permissions_update',
      resource_type: 'role',
      resource_id: roleId,
      details: `Updated permissions for role: ${role.name}`,
      before_value: { name: role.name, permissions: originalRole?.permissions || [] },
      after_value: { name: role.name, permissions: role.permissions }
    });

    toast({
      title: 'Role Updated',
      description: `Permissions for ${role.name} have been saved successfully.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Roles & Permissions</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Create New Role
        </button>
      </div>
      
      <div className="space-y-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
              <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                Delete Role
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allPermissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={role.permissions.includes('all') || role.permissions.includes(permission)}
                    onChange={() => togglePermission(role.id, permission)}
                    disabled={role.permissions.includes('all')}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">{permission.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
            
            <button 
              onClick={() => saveRoleChanges(role.id)}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Save Changes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesTab;
