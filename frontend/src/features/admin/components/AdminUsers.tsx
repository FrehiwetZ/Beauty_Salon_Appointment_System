import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { success, error: toastError } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { limit: 100, search } });
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (e) {
      toastError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/users/${userId}/status`, { isActive: !currentStatus });
      if (res.data.success) {
        success("User status updated successfully.");
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (e) {
      toastError("Failed to update user status.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user account? This will cascade delete their appointments and profile data.")) return;
    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        success("User deleted successfully.");
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (e) {
      toastError("Failed to delete user.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
        <input 
          type="text" 
          placeholder="Search by name, email..." 
          className="p-2 border rounded-lg text-sm max-w-xs w-full focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-pink-500 animate-pulse">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-gray-600 font-medium text-sm">Name</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-sm">Username</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-sm">Email</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-sm">Registered On</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-sm">Role</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {user.firstName || '—'} {user.lastName || ''}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.username}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'STAFF' ? 'bg-pink-100 text-pink-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right space-x-2">
                    <button 
                      onClick={() => handleToggleStatus(user.id, user.isActive)} 
                      className={`hover:underline text-xs font-semibold ${user.isActive ? 'text-amber-600' : 'text-green-600'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="text-red-600 hover:underline text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
