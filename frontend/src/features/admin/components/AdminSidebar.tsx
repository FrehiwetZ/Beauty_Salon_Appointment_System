import React from 'react';
import { useAuth } from '../../../context/AuthContext';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const { logout } = useAuth();
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'landing', label: '🎨 Landing Page CMS' },
    { id: 'users', label: 'Manage Users' },
    { id: 'staff', label: 'Manage Staff' },
    { id: 'services', label: 'Manage Services' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'news', label: 'News & Announcements' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
      <div className="p-6 bg-pink-600 text-white rounded-t-lg">
        <h2 className="font-bold text-xl">Admin Panel</h2>
        <p className="text-pink-100 text-sm mt-1">System Management</p>
      </div>
      
      <div className="flex flex-col flex-grow py-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-left font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-pink-50 text-pink-700 border-l-4 border-l-pink-600' 
                : 'text-gray-600 hover:bg-gray-50 border-l-4 border-l-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="w-full py-2 px-4 text-center text-red-600 font-medium hover:bg-red-50 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
