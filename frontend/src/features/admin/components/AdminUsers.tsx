import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { useLanguage } from '../../../context/LanguageContext';

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { success, error: toastError } = useToast();
  const { t } = useLanguage();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { limit: 100, search } });
      if (res.data.success) {
        // Enforce displaying ONLY registered normal users / customers (excluding ADMIN and STAFF)
        const customerList = (res.data.data || []).filter((u: any) => u.role === 'USER');
        setUsers(customerList);
      }
    } catch (e) {
      toastError(t('common.error'));
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
        success(t('admin.userStatusUpdated'));
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (e) {
      toastError(t('common.error'));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('admin.deleteUserConfirm'))) return;
    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        success(t('admin.userDeleted'));
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (e) {
      toastError(t('common.error'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-gray-800">{t('admin.manageUsers')}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-100">
              {users.length} {t('admin.totalUsers')}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {t('admin.registeredCustomersOnly')}
          </p>
        </div>
        <input 
          type="text" 
          placeholder={t('admin.searchUsersPlaceholder')} 
          className="p-2 border rounded-lg text-sm max-w-xs w-full focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-pink-500 animate-pulse">{t('common.loading')}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-400">{t('admin.noUsersFound')}</div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{user.firstName || '—'} {user.lastName || ''}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? t('common.active') : t('common.inactive')}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400">{t('admin.registeredOn')}: {new Date(user.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    className={`text-xs font-semibold cursor-pointer ${user.isActive ? 'text-amber-600' : 'text-green-600'}`}
                  >
                    {user.isActive ? t('common.deactivate') : t('common.activate')}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 text-xs font-semibold cursor-pointer"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-gray-600 font-medium text-sm">{t('common.name')}</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-sm">{t('auth.username')}</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-sm">{t('auth.email')}</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-sm">{t('admin.registeredOn')}</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-sm">{t('common.role')}</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-sm">{t('common.status')}</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-sm text-right">{t('common.actions')}</th>
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
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right space-x-2">
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.isActive)} 
                        className={`hover:underline text-xs font-semibold cursor-pointer ${user.isActive ? 'text-amber-600' : 'text-green-600'}`}
                      >
                        {user.isActive ? t('common.deactivate') : t('common.activate')}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)} 
                        className="text-red-600 hover:underline text-xs font-semibold cursor-pointer"
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminUsers;
