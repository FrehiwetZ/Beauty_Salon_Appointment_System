import React from 'react';
import { useData } from '../../../context/DataContext';

function AdminUsers() {
  const { usersList, updateUser } = useData();

  const handleRoleToggle = (userId: string) => {
    const user = usersList.find(u => u.id === userId);
    if (user) {
      updateUser({ ...user, role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">ID</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Name</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Email</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Role</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(user => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-500">{user.id}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{user.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  <button onClick={() => handleRoleToggle(user.id)} className="text-blue-600 hover:underline">
                    Toggle Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
