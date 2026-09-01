import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import DataOverview from '../components/DataOverview';
import AdminUsers from '../components/AdminUsers';
import AdminStaff from '../components/AdminStaff';
import AdminServices from '../components/AdminServices';
import AdminAppointments from '../components/AdminAppointments';
import AdminNews from '../components/AdminNews';
import AdminLandingPage from '../components/AdminLandingPage';
import { mockAdminStats } from '../types/admin';
import { dashboardService } from '../../../services/dashboard.service';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(mockAdminStats);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getDashboardData();
        if (res.success) {
          setStats({
            totalUsers: res.data.totalUsers,
            totalStaff: res.data.totalStaff,
            totalAppointments: res.data.totalAppointments,
            totalRevenue: res.data.totalRevenue,
          });
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchDashboard();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'reports': // Simplification: showing overview for reports too
        return <DataOverview stats={stats} />;
      case 'landing':
        return <AdminLandingPage />;
      case 'users':
        return <AdminUsers />;
      case 'staff':
        return <AdminStaff />;
      case 'services':
        return <AdminServices />;
      case 'appointments':
        return <AdminAppointments />;
      case 'news':
        return <AdminNews />;
      default:
        return <DataOverview stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-5 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <div className="flex-grow">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
