import { useState, useEffect } from "react";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { useBranding } from "../context/BrandingContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

// ── SVG Icon components for bottom nav (inline, no dependency) ──────────────
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
);
const IconServices = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>
);
const IconStaff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
);
const IconAppointments = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
);
const IconProfile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
);

// Map of page IDs to their icon components
const iconMap: Record<string, React.FC> = {
  landing: IconHome,
  dashboard: IconDashboard,
  services: IconServices,
  staff: IconStaff,
  appointments: IconAppointments,
  profile: IconProfile,
};

function Navbar() {
  const [open, setOpen] = useState(false);
  const { page, setPage } = useNavigation();
  const { isAuthenticated, user, logout } = useAuth();
  const { salonName, tagline } = useBranding();
  const { t } = useLanguage();

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Navigation for guests vs authenticated users
  const navItems = !isAuthenticated ? [
    { id: 'landing', label: t('nav.home') },
    { id: 'services', label: t('nav.servicesMenu') },
    { id: 'staff', label: t('nav.masterStylists') },
  ] : [
    { id: 'dashboard', label: t('nav.dashboard') },
    { id: 'landing', label: t('nav.studioShowcase') },
    { id: 'services', label: t('nav.services') },
    { id: 'staff', label: t('nav.stylists') },
    { id: 'appointments', label: t('nav.appointments') },
    { id: 'profile', label: t('nav.myProfile') },
  ];

  // Bottom nav shows the top 4-5 most important items (or all for guests since there are only 3)
  const bottomNavItems = !isAuthenticated ? [
    { id: 'landing', label: t('nav.home') },
    { id: 'services', label: t('nav.servicesMenu') },
    { id: 'staff', label: t('nav.masterStylists') },
  ] : [
    { id: 'dashboard', label: t('nav.dashboard') },
    { id: 'services', label: t('nav.services') },
    { id: 'appointments', label: t('nav.appointments') },
    { id: 'staff', label: t('nav.stylists') },
    { id: 'profile', label: t('nav.myProfile') },
  ];

  const handleNav = (id: string) => {
    setPage(id);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  if (user?.role === 'ADMIN') {
    return (
      <nav className="sticky top-0 z-50 salon-glass border-b border-rose-100/70 shadow-xs px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white font-serif font-bold text-base sm:text-lg shadow-sm flex-shrink-0">
            ✨
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold font-serif text-gray-900 leading-tight truncate">{salonName}</h1>
            <p className="text-[9px] sm:text-[10px] font-semibold text-pink-600 tracking-wider uppercase truncate">{t('nav.adminPortal')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <LanguageSwitcher variant="navbar" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-pink-50/70 border border-pink-100 rounded-full text-xs text-pink-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('nav.systemLive')}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-gray-200/80 cursor-pointer"
          >
            {t('nav.signOut')}
          </button>
        </div>
      </nav>
    );
  }

  if (user?.role === 'STAFF') {
    const staffDisplayName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || t('nav.stylists');
    return (
      <nav className="sticky top-0 z-50 salon-glass border-b border-rose-100/70 shadow-xs px-4 sm:px-8 py-3 sm:py-3.5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white font-serif font-bold text-base sm:text-lg shadow-sm flex-shrink-0">
            ✨
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold font-serif text-gray-900 leading-tight truncate">{salonName}</h1>
            <p className="text-[9px] sm:text-[10px] font-semibold text-pink-600 tracking-wider uppercase truncate">{t('nav.stylistPortal')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <LanguageSwitcher variant="navbar" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-pink-50/80 border border-pink-100 rounded-full text-xs text-pink-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="max-w-[140px] truncate">{staffDisplayName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-gray-200/80 cursor-pointer"
          >
            {t('nav.signOut')}
          </button>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 salon-glass border-b border-rose-100/70 shadow-xs px-4 sm:px-8 py-3 sm:py-3.5 flex justify-between items-center transition-all">
        {/* Left side: Hamburger (mobile) + Brand Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger — left side, opposite the language switcher */}
          <button
            className="w-10 h-10 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center focus:outline-none cursor-pointer hover:bg-pink-100 transition-colors active:scale-95 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center relative">
              <span className={`block w-5 h-0.5 bg-pink-700 rounded-full transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-0.5 bg-pink-700 rounded-full transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
              <span className={`block w-5 h-0.5 bg-pink-700 rounded-full transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>

          {/* Brand Logo */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group min-w-0"
            onClick={() => setPage(isAuthenticated ? 'dashboard' : 'landing')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-500 flex items-center justify-center text-white text-base sm:text-lg shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              ✨
            </div>
            <div className="min-w-0">
              <span className="font-serif font-bold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-gray-900 via-pink-900 to-pink-700 bg-clip-text text-transparent block leading-tight truncate">
                {salonName}
              </span>
              <span className="block text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-pink-600/80 uppercase -mt-0.5 truncate">
                {tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1.5 items-center">
          {navItems.map(item => {
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-3.5 lg:px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/25'
                    : 'text-gray-600 hover:text-pink-700 hover:bg-pink-50/60'
                  }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="h-5 w-px bg-gray-200 mx-2"></div>

          {/* Language Switcher */}
          <LanguageSwitcher variant="navbar" className="mr-1" />

          {!isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                onClick={() => handleNav('login')}
                className="px-3 sm:px-4 py-2 text-xs font-semibold text-gray-700 hover:text-pink-600 rounded-full transition-all cursor-pointer"
              >
                {t('nav.signIn')}
              </button>
              <button
                onClick={() => handleNav('register')}
                className="px-4 sm:px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-full shadow-sm shadow-pink-500/20 hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {t('nav.bookRegister')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                onClick={() => handleNav('profile')}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-pink-50/60 hover:bg-pink-50 border border-pink-100 rounded-full cursor-pointer transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                  {user?.name || t('nav.member')}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs font-medium text-gray-400 hover:text-rose-600 transition-colors px-2 py-1 cursor-pointer"
                title={t('nav.signOut')}
              >
                {t('nav.signOut')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile language switcher — right side */}
        <div className="flex items-center md:hidden">
          <LanguageSwitcher variant="navbar" />
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl p-5 sm:p-6 flex flex-col gap-2 md:hidden border-b border-rose-100 z-50 max-h-[calc(100vh-65px)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map(item => {
              const isActive = page === item.id;
              const IconComp = iconMap[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-pink-50/70 hover:text-pink-600'
                    }`}
                >
                  {IconComp && <IconComp />}
                  {item.label}
                </button>
              );
            })}

            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-2.5">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNav('login')}
                    className="w-full py-3 text-center text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    {t('nav.signIn')}
                  </button>
                  <button
                    onClick={() => handleNav('register')}
                    className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 rounded-xl shadow-md cursor-pointer"
                  >
                    {t('nav.bookRegister')}
                  </button>
                </>
              ) : (
                <div className="flex justify-between items-center px-2 py-2 bg-pink-50/50 rounded-xl">
                  <span className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                    {t('nav.loggedInAs')} {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer flex-shrink-0"
                  >
                    {t('nav.signOut')}
                  </button>
                </div>
              )}

              <div className="pt-2">
                <LanguageSwitcher variant="mobile" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Bottom Navigation Bar ─────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Subtle top edge glow */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pink-300/60 to-transparent" />

        <div className="bg-white/90 backdrop-blur-xl border-t border-rose-100/80 shadow-[0_-4px_20px_-4px_rgba(236,72,153,0.08)]">
          <div className="flex items-stretch justify-around px-1 py-1">
            {bottomNavItems.map(item => {
              const isActive = page === item.id;
              const IconComp = iconMap[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`
                    flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl
                    transition-all duration-200 cursor-pointer relative
                    ${isActive
                      ? 'text-pink-600'
                      : 'text-gray-400 active:text-pink-500'
                    }
                  `}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                  )}

                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {IconComp ? <IconComp /> : <IconHome />}
                  </span>
                  <span className={`text-[10px] leading-tight font-semibold truncate max-w-[60px] ${isActive ? 'text-pink-600' : 'text-gray-400'
                    }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;