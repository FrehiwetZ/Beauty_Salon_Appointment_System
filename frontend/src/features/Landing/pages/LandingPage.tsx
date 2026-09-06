import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/Button';
import { useNavigation } from '../../../context/NavigationContext';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { api } from '../../../services/api';

interface SiteSettings {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  showServices: boolean;
  showStaff: boolean;
  showPosts: boolean;
  showStats: boolean;
  statClients: string;
  statExperience: string;
  statRating: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  openingHours: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroBadge: '✨ The Premier Luxury Beauty & Hair Studio',
  heroTitle: 'Experience Elegance & Artistry In Every Style',
  heroSubtitle: 'Step into a world of bespoke haircuts, revitalizing facials, and luxury salon treatments tailored by master beauty artists.',
  heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
  aboutTitle: 'Crafting Confidence Through Bespoke Beauty',
  aboutDescription: 'At BEAUTY SALON, we combine state-of-the-art styling with organic luxury care. Our certified specialists craft personalized experiences designed to refresh your body, rejuvenate your mind, and elevate your personal style.',
  aboutImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  showServices: true,
  showStaff: true,
  showPosts: true,
  showStats: true,
  statClients: '2,500+',
  statExperience: '12+ Years',
  statRating: '4.9 / 5.0',
  contactPhone: '+1 (555) 389-7241',
  contactEmail: 'concierge@beautysalon.local',
  contactAddress: '450 Beverly Boulevard, Suite 200, Beverly Hills, CA',
  openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed'
};

function LandingPage() {
  const { setPage, setRedirectAfterLogin, setSelectedServiceId } = useNavigation();
  const { services, staffList, newsList } = useData();
  const { isAuthenticated } = useAuth();
  const { t, localizeService, localizeStaff, localizePost, language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/site/settings');
        if (res.data.success && res.data.data) {
          setSettings(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (e) {
        console.error('Failed to fetch site settings, using defaults', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    if (!isAuthenticated) {
      setRedirectAfterLogin('appointments');
      setPage('login');
    } else {
      setPage('appointments');
    }
  };

  const handleGeneralBooking = () => {
    if (!isAuthenticated) {
      setRedirectAfterLogin('appointments');
      setPage('login');
    } else {
      setPage('appointments');
    }
  };

  const heroBadgeText = language !== 'en' ? t('landing.heroBadge') : (settings.heroBadge || t('landing.heroBadge'));
  const heroTitleText = language !== 'en' ? t('landing.heroTitle') : (settings.heroTitle || t('landing.heroTitle'));
  const heroSubtitleText = language !== 'en' ? t('landing.heroSubtitle') : (settings.heroSubtitle || t('landing.heroSubtitle'));
  const aboutTitleText = language !== 'en' ? t('landing.aboutTitle') : (settings.aboutTitle || t('landing.aboutTitle'));
  const aboutDescText = language !== 'en' ? t('landing.aboutDescription') : (settings.aboutDescription || t('landing.aboutDescription'));

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col selection:bg-pink-500 selection:text-white">
      <Navbar />

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-pink-50/40 pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-xs font-semibold uppercase tracking-wider shadow-sm animate-pulse">
                {heroBadgeText}
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                {heroTitleText}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl font-normal leading-relaxed">
                {heroSubtitleText}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
                <button
                  onClick={handleGeneralBooking}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm sm:text-base cursor-pointer text-center"
                >
                  ✨ {t('landing.bookAppointment')}
                </button>
                <button
                  onClick={() => setPage(isAuthenticated ? 'services' : 'register')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl border border-gray-200 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm sm:text-base cursor-pointer text-center"
                >
                  {isAuthenticated ? t('landing.exploreMenu') : t('nav.bookRegister')}
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-8 border-t border-pink-100 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 text-base">✓</span> {t('landing.featureOrganicTitle')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 text-base">✓</span> {t('landing.featureStylistsTitle')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 text-base">✓</span> {t('landing.featureLuxuryTitle')}
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-pink-100">
                  <img
                    src={settings.heroImage}
                    alt="Luxury Salon Experience"
                    className="w-full h-72 sm:h-96 lg:h-[460px] object-cover object-center"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Floating Card */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-pink-100">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] sm:text-xs text-gray-500 font-medium">{t('landing.openingHours')}</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1">{settings.openingHours || 'Mon - Sat: 9am - 6pm'}</p>
                      </div>
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        ● {t('nav.systemLive')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. STATS SECTION ─── */}
      {settings.showStats && (
        <section className="bg-pink-600 text-white py-8 sm:py-12 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-2 sm:gap-8 text-center divide-x divide-pink-500/50">
              <div className="px-1 sm:px-4">
                <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold">{settings.statClients || '2,500+'}</div>
                <p className="text-pink-100 text-xs sm:text-sm mt-1">{t('landing.statClients')}</p>
              </div>
              <div className="px-1 sm:px-4">
                <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold">{settings.statExperience || '12+ Years'}</div>
                <p className="text-pink-100 text-xs sm:text-sm mt-1">{t('landing.statExperience')}</p>
              </div>
              <div className="px-1 sm:px-4">
                <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold">{settings.statRating || '4.9 / 5.0'}</div>
                <p className="text-pink-100 text-xs sm:text-sm mt-1">{t('landing.statRating')} ⭐</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── 3. SERVICES SHOWCASE ─── */}
      {settings.showServices && (
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">{t('landing.curatedMenu')}</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">{t('landing.signatureServices')}</h2>
              <p className="text-gray-600 text-base mt-3">{t('landing.servicesSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => {
                const sLoc = localizeService(service);
                return (
                  <div 
                    key={service.id} 
                    className="salon-card group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative bg-pink-100">
                      <img 
                        src={service.imageUrl || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80'} 
                        alt={sLoc.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-pink-600 font-bold text-sm shadow-sm">
                        {service.price} {t('common.currency', 'ETB')}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
                          <span>{sLoc.category || t('nav.services')}</span>
                          <span>⏱ {(service as any).durationMinutes || (service as any).duration || 45} {t('common.mins')}</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{sLoc.name}</h3>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{sLoc.description || t('landing.servicesSubtitle')}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{t('common.active')}</span>
                        <button
                          onClick={() => handleBookService(String(service.id))}
                          className="text-sm font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {t('landing.bookNow')} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {services.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage('services')}
                  className="px-6 py-3 border border-pink-300 text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
                >
                  {t('landing.viewFullMenu')} ({services.length})
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 4. ABOUT SECTION ─── */}
      <section className="py-20 bg-gradient-to-r from-pink-50/50 via-white to-pink-50/80 border-y border-pink-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src={settings.aboutImage}
                  alt="About BeautyCare"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">{t('landing.whyChooseUs')}</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {aboutTitleText}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {aboutDescText}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-pink-100/80 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{t('landing.featureOrganicTitle')}</h4>
                  <p className="text-xs text-gray-500">{t('landing.featureOrganicDesc')}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-pink-100/80 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{t('landing.featureLuxuryTitle')}</h4>
                  <p className="text-xs text-gray-500">{t('landing.featureLuxuryDesc')}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGeneralBooking}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {t('landing.bookNow')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. STAFF & STYLISTS SHOWCASE ─── */}
      {settings.showStaff && (
        <section id="staff" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">{t('landing.ourTeam')}</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">{t('landing.masterArtists')}</h2>
              <p className="text-gray-600 text-base mt-3">{t('landing.teamSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {staffList.slice(0, 4).map((staffMember) => {
                const fullName = `${staffMember.user?.firstName || staffMember.firstName || ''} ${staffMember.user?.lastName || staffMember.lastName || ''}`.trim() || staffMember.name || t('nav.stylists');
                const initial = fullName[0] || 'S';
                const sLoc = localizeStaff(staffMember);
                const staffImage = staffMember.staffProfile?.imageUrl || staffMember.imageUrl || staffMember.image;

                return (
                  <div key={staffMember.id} className="salon-card group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center p-6 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-lg mb-4 overflow-hidden">
                      {staffImage ? (
                        <img
                          src={staffImage}
                          alt={fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-pink-600 font-bold text-2xl">
                          {initial}
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-gray-900 text-lg group-hover:text-pink-600 transition-colors">{fullName}</h3>
                    <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider mt-1">{sLoc.position}</p>
                    <p className="text-gray-500 text-xs mt-3 line-clamp-3 leading-relaxed">{sLoc.bio}</p>

                    <div className="mt-5 pt-4 border-t border-gray-100 w-full flex justify-between items-center text-xs">
                      <span className="text-yellow-500 font-semibold">★ {staffMember.averageRating ? staffMember.averageRating.toFixed(1) : '5.0'}</span>
                      <button
                        onClick={handleGeneralBooking}
                        className="text-pink-600 hover:text-pink-700 font-bold hover:underline cursor-pointer"
                      >
                        {t('staff.bookWithStylist')} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. LATEST NEWS & ANNOUNCEMENTS ─── */}
      {settings.showPosts && (newsList || []).length > 0 && (
        <section id="posts" className="py-24 bg-gradient-to-b from-pink-50/30 via-white to-pink-50/20 border-t border-rose-100/60">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3.5 py-1.5 rounded-full border border-pink-100/80">
                {t('landing.storiesUpdates')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
                {t('landing.fromTheStudio')}
              </h2>
              <p className="text-gray-600 text-base mt-3 max-w-2xl mx-auto">
                {t('landing.newsSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(newsList || [])
                .filter((p: any) => p.status === 'APPROVED' || p.published)
                .slice(0, 3)
                .map((post: any) => {
                  const authorName = post.author
                    ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim()
                    : t('nav.stylists');
                  const postLoc = localizePost(post);

                  return (
                    <div 
                      key={post.id} 
                      className="salon-card bg-white rounded-3xl border border-rose-100/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-pink-200"
                    >
                      <div>
                        {post.imageUrl ? (
                          <div className="h-52 overflow-hidden relative bg-pink-50">
                            <img 
                              src={post.imageUrl} 
                              alt={postLoc.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                          </div>
                        ) : (
                          <div className="h-28 bg-gradient-to-tr from-pink-100/70 via-rose-50 to-pink-50/50 flex items-center justify-center text-pink-400 text-3xl">
                            ✨
                          </div>
                        )}
                        <div className="p-6 pb-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2.5">
                            <span className="font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                              {authorName}
                            </span>
                          </div>
                          <h3 className="font-serif font-bold text-gray-900 text-xl group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
                            {postLoc.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                            {postLoc.content}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => setPage('dashboard')}
                          className="text-xs text-pink-600 font-bold group-hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {t('landing.readMore')} →
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* ─── 7. CTA BANNER ─── */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">{t('landing.heroTitle')}</h2>
          <p className="text-pink-100 text-base sm:text-lg max-w-2xl mx-auto">
            {t('landing.heroSubtitle')}
          </p>
          <div className="pt-2">
            <button
              onClick={handleGeneralBooking}
              className="px-8 py-4 bg-white text-pink-600 hover:bg-gray-50 font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-100 transition-all text-base cursor-pointer"
            >
              {t('landing.bookNow')}
            </button>
          </div>
        </div>
      </section>

      {/* ─── 8. CONTACT & LOCATION INFO ─── */}
      <section className="py-12 bg-white border-t border-gray-100 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">📍 {t('landing.address')}</h4>
            <p>{settings.contactAddress}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">⏰ {t('landing.openingHours')}</h4>
            <p>{settings.openingHours}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">📞 {t('landing.contactUs')}</h4>
            <p>{settings.contactPhone}</p>
            <p>{settings.contactEmail}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
