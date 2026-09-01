import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import ImageUpload from '../../../components/ImageUpload';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';

function AdminLandingPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    aboutTitle: '',
    aboutDescription: '',
    aboutImage: '',
    showServices: true,
    showStaff: true,
    showPosts: true,
    showStats: true,
    statClients: '',
    statExperience: '',
    statRating: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    openingHours: ''
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/site/settings');
      if (res.data.success && res.data.data) {
        setFormData(res.data.data);
      }
    } catch (e) {
      toastError("Failed to fetch landing page settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/site/settings', formData);
      if (res.data.success) {
        success("Landing page settings updated successfully!");
        setFormData(res.data.data);
      }
    } catch (e: any) {
      toastError(e.response?.data?.message || "Failed to update landing page settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center text-pink-600 font-medium animate-pulse">
        Loading landing page CMS settings...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Landing Page Management</h2>
          <p className="text-xs text-gray-500 mt-1">Customize the public landing page hero, story, images, statistics, and section visibility.</p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ─── 1. HERO SECTION ─── */}
        <div className="bg-pink-50/40 p-5 rounded-xl border border-pink-100 space-y-4">
          <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wider">1. Hero Section</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hero Badge Text</label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={e => setFormData({ ...formData, heroBadge: e.target.value })}
                  placeholder="e.g. ✨ The Premier Luxury Beauty & Hair Studio"
                  className="w-full p-2.5 border rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hero Main Title (H1)</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="e.g. Experience Elegance & Artistry In Every Style"
                  className="w-full p-2.5 border rounded-lg text-sm font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={formData.heroSubtitle}
                  onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Write a welcoming description for public visitors..."
                  className="w-full p-2.5 border rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                label="Hero Background / Cover Image (Cloudflare R2)"
                folder="landing"
                aspectRatio="video"
                value={formData.heroImage}
                onChange={url => setFormData({ ...formData, heroImage: url })}
              />
            </div>
          </div>
        </div>

        {/* ─── 2. ABOUT STORY SECTION ─── */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">2. About Studio Story</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">About Section Title</label>
                <input
                  type="text"
                  value={formData.aboutTitle}
                  onChange={e => setFormData({ ...formData, aboutTitle: e.target.value })}
                  placeholder="e.g. Crafting Confidence Through Bespoke Beauty"
                  className="w-full p-2.5 border rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">About Story Description</label>
                <textarea
                  rows={4}
                  value={formData.aboutDescription}
                  onChange={e => setFormData({ ...formData, aboutDescription: e.target.value })}
                  placeholder="Tell your salon's story and philosophy..."
                  className="w-full p-2.5 border rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                label="About Studio Feature Image (Cloudflare R2)"
                folder="landing"
                aspectRatio="video"
                value={formData.aboutImage}
                onChange={url => setFormData({ ...formData, aboutImage: url })}
              />
            </div>
          </div>
        </div>

        {/* ─── 3. STATS & NUMBERS ─── */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">3. Statistics & Achievements</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Clients Served</label>
              <input
                type="text"
                value={formData.statClients}
                onChange={e => setFormData({ ...formData, statClients: e.target.value })}
                placeholder="e.g. 2,500+"
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Experience Years</label>
              <input
                type="text"
                value={formData.statExperience}
                onChange={e => setFormData({ ...formData, statExperience: e.target.value })}
                placeholder="e.g. 12+ Years"
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Average Star Rating</label>
              <input
                type="text"
                value={formData.statRating}
                onChange={e => setFormData({ ...formData, statRating: e.target.value })}
                placeholder="e.g. 4.9 / 5.0"
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
          </div>
        </div>

        {/* ─── 4. SECTION VISIBILITY CONTROLS ─── */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">4. Section Visibility Toggles</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 p-3 bg-white border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showServices}
                onChange={e => setFormData({ ...formData, showServices: e.target.checked })}
                className="accent-pink-600 h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Services Menu</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-white border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showStaff}
                onChange={e => setFormData({ ...formData, showStaff: e.target.checked })}
                className="accent-pink-600 h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Staff Showcase</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-white border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showPosts}
                onChange={e => setFormData({ ...formData, showPosts: e.target.checked })}
                className="accent-pink-600 h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Latest Blog Posts</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-white border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showStats}
                onChange={e => setFormData({ ...formData, showStats: e.target.checked })}
                className="accent-pink-600 h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Stats Banner</span>
            </label>
          </div>
        </div>

        {/* ─── 5. CONTACT & LOCATION INFO ─── */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">5. Footer Contact & Hours</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="e.g. +1 (555) 389-7241"
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="concierge@beautycare.local"
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Studio Address</label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={e => setFormData({ ...formData, contactAddress: e.target.value })}
                placeholder="450 Beverly Boulevard, Suite 200..."
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={e => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="Mon - Sat: 9:00 AM - 6:00 PM..."
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={fetchSettings}>
            Reset Changes
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save All Changes'}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default AdminLandingPage;
