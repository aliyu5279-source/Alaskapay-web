import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logAdminAction } from '@/lib/auditLogger';
import { useToast } from '@/hooks/use-toast';

const UsersTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', balance: 25000, status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', balance: 15000, status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', balance: 5000, status: 'suspended' },
  ]);

  const toggleStatus = async (id: string) => {
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) return;

    const oldStatus = targetUser.status;
    const newStatus = oldStatus === 'active' ? 'suspended' : 'active';

    // Log the admin action
    await logAdminAction({
      action: 'user_status_change',
      resource_type: 'user',
      resource_id: id,
      details: `Changed user status from ${oldStatus} to ${newStatus} for ${targetUser.email}`,
      before_value: { status: oldStatus, email: targetUser.email, name: targetUser.name },
      after_value: { status: newStatus, email: targetUser.email, name: targetUser.name }
    });

    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: newStatus } : u
    ));

    toast({
      title: 'User Status Updated',
      description: `${targetUser.name} has been ${newStatus === 'active' ? 'activated' : 'suspended'}.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Add New User
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Balance</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">₦{user.balance.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      user.status === 'active' 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;
