import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const tabs = [
    { id: 'overview', label: `📊 ${t('admin.overview')}` },
    { id: 'users', label: `👥 ${t('admin.manageUsers')}` },
    { id: 'staff', label: `✂️ ${t('admin.manageStaff')}` },
    { id: 'services', label: `💆 ${t('admin.manageServices')}` },
    { id: 'appointments', label: `📅 ${t('admin.manageAppointments')}` },
    { id: 'news', label: `📰 ${t('admin.manageNews')}` },
    { id: 'branding', label: `🏷️ ${t('admin.brandingCms')}` },
    { id: 'landing', label: `🎨 Landing Page CMS` },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const activeTab_label = tabs.find(t => t.id === activeTab)?.label ?? tabs[0].label;

  return (
    <>
      {/* Mobile tab picker bar */}
      <div className="md:hidden w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-pink-600 text-white font-semibold text-sm cursor-pointer"
          aria-expanded={mobileOpen}
          aria-label="Toggle admin menu"
        >
          <span>{activeTab_label}</span>
          <span className="text-lg">{mobileOpen ? '▲' : '▼'}</span>
        </button>

        {mobileOpen && (
          <div className="flex flex-col border-t border-pink-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-5 py-3 text-left text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-pink-50 text-pink-700 border-l-4 border-l-pink-600'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={logout}
                className="w-full py-2 px-4 text-center text-red-600 font-medium hover:bg-red-50 rounded transition-colors cursor-pointer text-sm"
              >
                {t('nav.signOut')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 bg-white rounded-lg shadow-sm border border-gray-100 flex-col h-full min-h-[500px] flex-shrink-0">
        <div className="p-6 bg-pink-600 text-white rounded-t-lg">
          <h2 className="font-bold text-xl">{t('admin.dashboard')}</h2>
          <p className="text-pink-100 text-sm mt-1">{t('nav.adminPortal')}</p>
        </div>
        
        <div className="flex flex-col flex-grow py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-left font-medium transition-colors cursor-pointer ${
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
            className="w-full py-2 px-4 text-center text-red-600 font-medium hover:bg-red-50 rounded transition-colors cursor-pointer"
          >
            {t('nav.signOut')}
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
