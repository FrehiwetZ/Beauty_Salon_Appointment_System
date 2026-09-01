import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/Button';
import { useNavigation } from '../../../context/NavigationContext';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
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
  aboutDescription: 'At BeautyCare, we combine state-of-the-art styling with organic luxury care. Our certified specialists craft personalized experiences designed to refresh your body, rejuvenate your mind, and elevate your personal style.',
  aboutImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  showServices: true,
  showStaff: true,
  showPosts: true,
  showStats: true,
  statClients: '2,500+',
  statExperience: '12+ Years',
  statRating: '4.9 / 5.0',
  contactPhone: '+1 (555) 389-7241',
  contactEmail: 'concierge@beautycare.local',
  contactAddress: '450 Beverly Boulevard, Suite 200, Beverly Hills, CA',
  openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed'
};

function LandingPage() {
  const { setPage, setRedirectAfterLogin, setSelectedServiceId } = useNavigation();
  const { services, staffList, newsList } = useData();
  const { isAuthenticated } = useAuth();
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
                {settings.heroBadge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                {settings.heroTitle}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl font-normal leading-relaxed">
                {settings.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <button
                  onClick={handleGeneralBooking}
                  className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base"
                >
                  ✨ Book Your Appointment
                </button>
                <button
                  onClick={() => setPage(isAuthenticated ? 'services' : 'register')}
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl border border-gray-200 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base"
                >
                  {isAuthenticated ? 'View All Services' : 'Join as Member'}
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-8 border-t border-pink-100 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 text-base">✓</span> Organic Vegan Products
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 text-base">✓</span> Master Certified Stylists
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 text-base">✓</span> 100% Satisfaction Guarantee
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-pink-400 to-rose-300 rounded-3xl filter blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                  <img
                    src={settings.heroImage}
                    alt="Salon Artistry"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xs uppercase tracking-widest text-pink-300 font-bold mb-1">Featured Salon Look</p>
                    <p className="text-lg font-bold">Signature Balayage & Botanical Care</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. STATS BAR ─── */}
      {settings.showStats && (
        <section className="bg-pink-600 text-white py-8 shadow-inner">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold">{settings.statClients}</div>
                <p className="text-pink-100 text-sm mt-1">Delighted Clients</p>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold">{services.length || '15+'}</div>
                <p className="text-pink-100 text-sm mt-1">Exclusive Services</p>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold">{settings.statExperience}</div>
                <p className="text-pink-100 text-sm mt-1">Artisan Mastery</p>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold">{settings.statRating}</div>
                <p className="text-pink-100 text-sm mt-1">Client Rating ⭐</p>
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
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">Our Signature Menu</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">Luxury Treatments Tailored For You</h2>
              <p className="text-gray-600 text-base mt-3">From bespoke precision haircuts to rejuvenating organic facials and restorative treatments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => (
                <div 
                  key={service.id} 
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative bg-pink-100">
                    <img 
                      src={service.imageUrl || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80'} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-pink-600 font-bold text-sm shadow-sm">
                      ${service.price}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
                        <span>{service.category || 'Specialty Service'}</span>
                        <span>⏱ {(service as any).durationMinutes || (service as any).duration || 45} mins</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{service.name}</h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{service.description || 'Experience personalized salon care with our certified aesthetic masters.'}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Available Daily</span>
                      <button
                        onClick={() => handleBookService(String(service.id))}
                        className="text-sm font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
                      >
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {services.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage('services')}
                  className="px-6 py-3 border border-pink-300 text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-colors"
                >
                  View All {services.length} Services
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
                  className="w-full h-96 object-cover object-center"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-pink-100 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xl font-bold">✨</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Certified Excellence</h4>
                    <p className="text-xs text-gray-500">Top-rated beauty boutique</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">About Our Studio</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {settings.aboutTitle}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {settings.aboutDescription}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-800 text-sm">Modern Sanitization</h4>
                  <p className="text-xs text-gray-500 mt-1">Medical-grade hygiene and clean air filtration.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-800 text-sm">Personalized Care</h4>
                  <p className="text-xs text-gray-500 mt-1">Every treatment customized to your hair and skin type.</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGeneralBooking}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  Reserve Your Visit
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
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">Meet Our Artisans</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">Master Stylists & Therapists</h2>
              <p className="text-gray-600 text-base mt-3">Passionate, certified professionals committed to bringing out your best look.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {staffList.slice(0, 4).map((staffMember) => {
                const fullName = `${staffMember.user?.firstName || staffMember.firstName || ''} ${staffMember.user?.lastName || staffMember.lastName || ''}`.trim() || staffMember.name || 'Master Stylist';
                const initial = fullName[0] || 'S';
                const position = staffMember.staffProfile?.position || staffMember.position || 'Stylist';
                const bio = staffMember.staffProfile?.bio || staffMember.specialty || 'Specialist in precision cuts and treatment styling.';
                const staffImage = staffMember.staffProfile?.imageUrl || staffMember.imageUrl || staffMember.image;

                return (
                  <div key={staffMember.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center p-6 flex flex-col items-center">
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

                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-pink-600 transition-colors">{fullName}</h3>
                    <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider mt-1">{position}</p>
                    <p className="text-gray-500 text-xs mt-3 line-clamp-3 leading-relaxed">{bio}</p>

                    <div className="mt-5 pt-4 border-t border-gray-100 w-full flex justify-between items-center text-xs">
                      <span className="text-yellow-500 font-semibold">★ {staffMember.averageRating ? staffMember.averageRating.toFixed(1) : '5.0'}</span>
                      <button
                        onClick={handleGeneralBooking}
                        className="text-pink-600 hover:text-pink-700 font-bold hover:underline"
                      >
                        Book With {staffMember.user?.firstName || staffMember.firstName || 'Stylist'} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. LATEST NEWS & POSTS ─── */}
      {settings.showPosts && newsList.length > 0 && (
        <section id="posts" className="py-20 bg-pink-50/40 border-t border-pink-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">From The Blog</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">Trends, Tips & Announcements</h2>
              <p className="text-gray-600 text-base mt-3">Stay updated with the latest beauty tutorials, seasonal promotions, and studio updates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsList.slice(0, 3).map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg line-clamp-2 hover:text-pink-600 transition-colors">{post.title}</h3>
                      <p className="text-gray-500 text-sm mt-3 line-clamp-3 leading-relaxed">{post.content}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
                      Published {new Date(post.date || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 7. CTA BANNER ─── */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready To Transform Your Look?</h2>
          <p className="text-pink-100 text-base sm:text-lg max-w-2xl mx-auto">
            Book your appointment in less than 2 minutes. Select your favorite service, choose your preferred stylist, and pick an available time slot.
          </p>
          <div className="pt-2">
            <button
              onClick={handleGeneralBooking}
              className="px-8 py-4 bg-white text-pink-600 hover:bg-gray-50 font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-100 transition-all text-base"
            >
              Book Now — Instant Confirmation
            </button>
          </div>
        </div>
      </section>

      {/* ─── 8. CONTACT & LOCATION INFO ─── */}
      <section className="py-12 bg-white border-t border-gray-100 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">📍 Studio Location</h4>
            <p>{settings.contactAddress}</p>
            <p className="text-gray-400 text-xs">Valet parking available for all clients.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">⏰ Operating Hours</h4>
            <p>{settings.openingHours}</p>
            <p className="text-gray-400 text-xs">Walk-ins welcome based on availability.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">📞 Concierge & Inquiries</h4>
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
