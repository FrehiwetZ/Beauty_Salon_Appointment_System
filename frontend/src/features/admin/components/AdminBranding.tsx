import { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { useBranding, DEFAULT_SALON_NAME, DEFAULT_TAGLINE } from '../../../context/BrandingContext';
import { useToast } from '../../../context/ToastContext';
import { useLanguage } from '../../../context/LanguageContext';

export function AdminBranding() {
  const { salonName, tagline, updateBranding } = useBranding();
  const { success, error: toastError } = useToast();
  const { t } = useLanguage();

  const [nameInput, setNameInput] = useState(salonName);
  const [taglineInput, setTaglineInput] = useState(tagline);
  const [saving, setSaving] = useState(false);

  // Sync state if context changes externally
  useEffect(() => {
    setNameInput(salonName);
    setTaglineInput(tagline);
  }, [salonName, tagline]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updateBranding(nameInput, taglineInput);
    setSaving(false);

    if (res.success) {
      success('Website branding updated successfully! All pages updated.');
    } else {
      toastError(res.message || 'Failed to update website branding.');
    }
  };

  const handleResetToDefault = () => {
    setNameInput(DEFAULT_SALON_NAME);
    setTaglineInput(DEFAULT_TAGLINE);
  };

  const hasChanges = nameInput !== salonName || taglineInput !== tagline;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏷️</span>
            <h2 className="text-xl font-bold text-gray-900">{t('admin.brandingCms', 'Website Branding / Site Settings')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your official salon branding. Settings are stored persistently in the database and appear instantly across all pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={handleResetToDefault}
            disabled={saving}
          >
            ↺ {t('common.reset', 'Set Default')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '...' : `💾 ${t('admin.saveSettings', 'Save Changes')}`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-800 text-base">Customization Details</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Edit the salon name and the quote or tagline displayed directly underneath it.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Salon Name Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Website / Salon Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. BEAUTY SALON"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Default: <span className="font-semibold text-pink-600">BEAUTY SALON</span>. This is your primary salon name.
              </p>
            </div>

            {/* Tagline / Quote Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Quote / Tagline Underneath Name
              </label>
              <input
                type="text"
                value={taglineInput}
                onChange={(e) => setTaglineInput(e.target.value)}
                placeholder="e.g. “Your Beauty, Your Time.”"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Default: <span className="font-semibold text-pink-600">“Your Beauty, Your Time.”</span>. Always displayed directly beneath the website name.
              </p>
            </div>

            {/* Change Indicator / Submit */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                {hasChanges ? (
                  <span className="text-amber-600 font-semibold">● Unsaved changes</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">✓ In sync with live website</span>
                )}
              </span>

              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Interactive Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>👁️</span> Real-time Live Previews
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Here is how your customized branding will appear to clients and guests:
            </p>

            {/* 1. Navbar Preview */}
            <div className="mb-4">
              <p className="text-[10px] uppercase font-bold text-pink-600 tracking-wider mb-1.5">
                1. Navigation Bar Preview
              </p>
              <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-500 flex items-center justify-center text-white text-base shadow-sm">
                  ✨
                </div>
                <div>
                  <span className="font-serif font-bold text-lg tracking-tight bg-gradient-to-r from-gray-900 via-pink-900 to-pink-700 bg-clip-text text-transparent block leading-tight">
                    {nameInput || DEFAULT_SALON_NAME}
                  </span>
                  <span className="block text-[9px] font-bold tracking-[0.2em] text-pink-600/80 uppercase">
                    {taglineInput || DEFAULT_TAGLINE}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Auth / Login Card Preview */}
            <div className="mb-4">
              <p className="text-[10px] uppercase font-bold text-pink-600 tracking-wider mb-1.5">
                2. Login &amp; Register Header Preview
              </p>
              <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-pink-600 text-white text-sm mb-1.5">
                  ✨
                </div>
                <h4 className="font-serif font-bold text-base text-gray-900 tracking-tight">
                  {nameInput || DEFAULT_SALON_NAME}
                </h4>
                <p className="text-[10px] font-semibold text-pink-600/90 tracking-wide mt-0.5">
                  {taglineInput || DEFAULT_TAGLINE}
                </p>
              </div>
            </div>

            {/* 3. Footer Preview */}
            <div>
              <p className="text-[10px] uppercase font-bold text-pink-600 tracking-wider mb-1.5">
                3. Footer Brand Preview
              </p>
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 text-gray-300">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 text-xs">
                    ✨
                  </div>
                  <div>
                    <span className="font-serif font-bold text-white text-sm tracking-tight block">
                      {nameInput || DEFAULT_SALON_NAME}
                    </span>
                    <p className="text-[10px] text-gray-400">
                      {taglineInput || DEFAULT_TAGLINE}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-800/80 pt-2 text-[10px] text-gray-500">
                  © {new Date().getFullYear()} {nameInput || DEFAULT_SALON_NAME}. All rights reserved.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBranding;
