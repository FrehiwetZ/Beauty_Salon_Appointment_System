import { useBranding } from '../context/BrandingContext';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  companyName?: string;
  className?: string;
}

export function Footer({ 
  companyName, 
  className = "" 
}: FooterProps) {
  const { salonName, tagline } = useBranding();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const displayTitle = companyName || salonName;

  return (
    <footer
      className={`
        bg-gradient-to-b from-gray-900 to-black text-gray-400 pt-12 pb-8 border-t border-rose-950/60
        ${className}
      `.trim()}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-serif text-base">
              ✨
            </div>
            <div>
              <span className="font-serif font-bold text-white text-lg tracking-tight">{displayTitle}</span>
              <p className="text-[11px] text-gray-400">{tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-400">
            <span>{t('landing.openingHours')}: Mon - Sat 9:00 AM - 6:00 PM</span>
            <span>•</span>
            <span>{t('landing.featureLuxuryTitle')}</span>
            <span>•</span>
            <span>{t('nav.masterStylists')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-xs text-gray-500">
          <p>© {currentYear} {displayTitle}. {t('footer.allRightsReserved')}</p>
          <p className="text-[11px] text-gray-600">{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;