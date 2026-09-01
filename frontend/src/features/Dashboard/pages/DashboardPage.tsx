import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import DashboardStats from '../components/DashboardStats';
import RecentActivity from '../components/RecentActivity';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { dashboardService } from '../../../services/dashboard.service';

function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { newsList } = useData();
  const [stats, setStats] = React.useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedServices: 0,
    activeIntegrations: 0,
  });
  const [activities, setActivities] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const fetchStats = async () => {
      if (isAuthenticated && user?.role === 'USER') {
        try {
          const res = await dashboardService.getDashboardData();
          if (res.success) {
            setStats({
              totalAppointments: res.data.totalAppointments,
              upcomingAppointments: res.data.upcomingAppointments,
              completedServices: 0,
              activeIntegrations: 0,
            });
            const recent = res.data.recentAppointments || [];
            setActivities(recent.map((apt: any) => ({
              id: apt.id,
              description: `Appointment for ${apt.service?.name} is ${apt.status.toLowerCase()}.`,
              date: `${apt.date} ${apt.startTime}`,
              type: 'appointment'
            })));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchStats();
  }, [isAuthenticated, user]);

  const publishedNews = newsList; // already filtered from backend usually, but let's just use it

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-5 py-12">
        <div className="mb-10">
          <p className="text-pink-600 font-medium">Dashboard</p>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">
            {isAuthenticated ? `Welcome Back, ${user?.name}!` : 'Welcome to BeautyCare!'}
          </h1>
          <p className="text-gray-600 mt-3">
            {isAuthenticated 
              ? "Here's a quick overview of your upcoming appointments and news." 
              : "Sign in to manage your appointments and profile."}
          </p>
        </div>

        {publishedNews.length > 0 && (
          <div className="mb-10 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Latest Staff Posts & Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedNews.map(news => (
                <div key={news.id} className="bg-white border border-pink-100 rounded-lg shadow-sm overflow-hidden flex flex-col">
                  {news.imageUrl && (
                    <img src={news.imageUrl} alt={news.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-pink-800 text-lg line-clamp-2">{news.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      By {news.author?.firstName} {news.author?.lastName} • {new Date(news.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-3">{news.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="space-y-8">
            <DashboardStats stats={stats} />
            <RecentActivity activities={activities} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;
