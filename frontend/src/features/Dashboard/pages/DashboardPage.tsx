import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import DashboardStats from '../components/DashboardStats';
import RecentActivity from '../components/RecentActivity';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { useBranding } from '../../../context/BrandingContext';
import { useLanguage } from '../../../context/LanguageContext';
import { dashboardService } from '../../../services/dashboard.service';

function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { newsList } = useData();
  const { salonName } = useBranding();
  const { t, localizePost, localizeService } = useLanguage();
  const [stats, setStats] = React.useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedServices: 0,
    activeIntegrations: 0,
  });
  const [activities, setActivities] = React.useState<any[]>([]);
  const [expandedPostIds, setExpandedPostIds] = React.useState<Record<string, boolean>>({});

  const toggleExpandPost = (id: string) => {
    setExpandedPostIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
            setActivities(recent.map((apt: any) => {
              const sLoc = localizeService(apt.service);
              const statusName = t(`status.${apt.status}`, apt.status);
              return {
                id: apt.id,
                description: `${sLoc.name || 'Service'} — ${statusName}`,
                date: `${apt.date} ${apt.startTime}`,
                type: 'appointment'
              };
            }));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchStats();
  }, [isAuthenticated, user, t]);

  const publishedNews = newsList; // already filtered from backend usually, but let's just use it

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-slate-50 to-pink-50/30 flex flex-col selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
            {t('dashboard.welcome')}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-3 tracking-tight">
            {isAuthenticated ? `${t('dashboard.welcome')}, ${user?.name}!` : `${t('dashboard.welcome')} ${salonName}`}
          </h1>
          <p className="text-gray-600 mt-3 text-base">
            {isAuthenticated
              ? t('dashboard.subtitle')
              : t('auth.enterDetailsToSignIn')}
          </p>
        </div>

        {publishedNews.length > 0 && (
          <div className="mb-12 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                {t('landing.storiesUpdates')}
              </h2>
              <span className="text-xs text-pink-600 font-semibold bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                {publishedNews.length} {publishedNews.length === 1 ? t('admin.createPost', 'Post') : t('admin.manageNews', 'Posts')}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedNews.map(news => {
                const authorName = news.author
                  ? `${news.author.firstName || ''} ${news.author.lastName || ''}`.trim()
                  : t('nav.stylists', 'Salon Stylist');
                const isStaff = news.author?.role === 'STAFF';
                const isExpanded = !!expandedPostIds[news.id];
                const postLoc = localizePost(news);
                const content = postLoc.content || '';
                const isLong = content.length > 130 || content.includes('\n');

                return (
                  <div key={news.id} className="salon-card bg-white border border-rose-100/80 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-pink-200 group transition-all">
                    {news.imageUrl ? (
                      <div className="h-48 overflow-hidden relative bg-pink-50">
                        <img
                          src={news.imageUrl}
                          alt={postLoc.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-pink-700 border border-pink-100 shadow-xs">
                          {isStaff ? t('posts.stylistPost', 'Stylist Post') : t('posts.studioExclusive', 'Studio Exclusive')}
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 bg-gradient-to-tr from-pink-100/70 via-rose-50 to-pink-50/50 flex items-center justify-center text-pink-400 text-2xl">
                        ✨
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span className="font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                          {t('posts.byAuthor', 'By {name}', { name: authorName })}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(news.createdAt || news.date || Date.now()).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-pink-600 transition-colors">
                        {postLoc.title}
                      </h3>
                      <p className={`text-gray-600 text-sm mt-2 leading-relaxed ${isExpanded ? 'whitespace-pre-line' : 'line-clamp-3'}`}>
                        {postLoc.content}
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => toggleExpandPost(news.id)}
                          className="mt-3 text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline inline-flex items-center gap-1 cursor-pointer self-start transition-colors"
                        >
                          {isExpanded ? `${t('common.close', 'Close')} ↑` : `${t('landing.readMore', 'Read More')} ↓`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
