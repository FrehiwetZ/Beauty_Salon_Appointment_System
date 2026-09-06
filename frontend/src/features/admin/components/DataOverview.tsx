import { SystemStats } from '../types/admin';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  stats: SystemStats;
}

function DataOverview({ stats }: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{t('admin.overview')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">{t('admin.totalUsers')}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers.toLocaleString()}</p>
        </div>
        
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">{t('admin.totalRevenue')}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalRevenue.toLocaleString()} ETB</p>
        </div>
        
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">{t('admin.totalStaff')}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalStaff?.toLocaleString() ?? 0}</p>
        </div>
        
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">{t('admin.totalAppointments')}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalAppointments?.toLocaleString() ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export default DataOverview;
