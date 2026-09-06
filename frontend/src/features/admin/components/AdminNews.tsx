import React, { useState } from 'react';
import Button from '../../../components/Button';
import ImageUpload from '../../../components/ImageUpload';
import { useData } from '../../../context/DataContext';
import { useLanguage } from '../../../context/LanguageContext';

function AdminNews() {
  const { newsList, addNews, deleteNews, updateNews, refreshNews } = useData();
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [formData, setFormData] = useState({
    title: '',
    titleAm: '',
    titleOm: '',
    content: '',
    contentAm: '',
    contentOm: '',
    imageUrl: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal State
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editData, setEditData] = useState({
    title: '',
    titleAm: '',
    titleOm: '',
    content: '',
    contentAm: '',
    contentOm: '',
    imageUrl: '',
    status: 'APPROVED'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await addNews({
        title: formData.title.trim(),
        titleAm: formData.titleAm.trim() || undefined,
        titleOm: formData.titleOm.trim() || undefined,
        content: formData.content.trim(),
        contentAm: formData.contentAm.trim() || undefined,
        contentOm: formData.contentOm.trim() || undefined,
        imageUrl: formData.imageUrl || null,
        status: 'APPROVED',
      });
      setIsAdding(false);
      setFormData({
        title: '',
        titleAm: '',
        titleOm: '',
        content: '',
        contentAm: '',
        contentOm: '',
        imageUrl: ''
      });
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (post: any) => {
    const isCurrentlyActive = post.status === 'APPROVED';
    const newStatus = isCurrentlyActive ? 'REJECTED' : 'APPROVED';
    const action = isCurrentlyActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this announcement?`)) return;
    try {
      await updateNews({ ...post, status: newStatus });
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${action} announcement.`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this announcement?')) return;
    try {
      await deleteNews(id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete announcement.');
    }
  };

  const handleEditClick = (post: any) => {
    setEditingPost(post);
    setEditData({
      title: post.title || '',
      titleAm: post.titleAm || '',
      titleOm: post.titleOm || '',
      content: post.content || '',
      contentAm: post.contentAm || '',
      contentOm: post.contentOm || '',
      imageUrl: post.imageUrl || '',
      status: post.status || 'APPROVED',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      await updateNews({
        id: editingPost.id,
        title: editData.title.trim(),
        titleAm: editData.titleAm.trim() || undefined,
        titleOm: editData.titleOm.trim() || undefined,
        content: editData.content.trim(),
        contentAm: editData.contentAm.trim() || undefined,
        contentOm: editData.contentOm.trim() || undefined,
        imageUrl: editData.imageUrl || null,
        status: editData.status,
      });
      setEditingPost(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update announcement.');
    }
  };

  const filteredPosts = (newsList || []).filter((post: any) => {
    const isActive = post.status === 'APPROVED';
    if (filter === 'ACTIVE') return isActive;
    if (filter === 'INACTIVE') return !isActive;
    return true;
  });

  const activeCount = (newsList || []).filter((p: any) => p.status === 'APPROVED').length;
  const inactiveCount = (newsList || []).length - activeCount;

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-rose-100/70 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
            Salon Communications
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">{t('admin.manageNews', 'Announcements & News Studio')}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Admin oversight: Full authority to view, edit, activate/deactivate, and delete all staff and salon posts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshNews && refreshNews()}
            className="p-2 text-gray-500 hover:text-pink-600 border border-gray-200 rounded-xl hover:border-pink-300 transition-all text-sm cursor-pointer"
            title={t('common.refresh', 'Refresh announcements')}
          >
            🔄
          </button>
          {!isAdding && (
            <Button onClick={() => { setIsAdding(true); setFormError(null); }}>
              + {t('admin.createPost', 'Create Announcement')}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Posts ({newsList?.length || 0})
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'ACTIVE'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Active • Published ({activeCount})
        </button>
        <button
          onClick={() => setFilter('INACTIVE')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'INACTIVE'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Deactivated • Hidden ({inactiveCount})
        </button>
      </div>

      {/* New Announcement Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-4 sm:p-6 border border-pink-100 rounded-2xl bg-gradient-to-b from-pink-50/50 to-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-pink-100 pb-3">
            <h3 className="font-bold text-gray-800 text-lg">Create Official Salon Announcement</h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Admin Broadcast
            </span>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title (English) *</label>
              <input
                required
                placeholder="e.g. Grand Reopening & Exclusive Autumn Salon Packages"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ርዕስ (አማርኛ - Optional)</label>
                <input
                  placeholder="የማስታወቂያ ርዕስ በአማርኛ..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  value={formData.titleAm}
                  onChange={e => setFormData({...formData, titleAm: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mata Duree (Afaan Oromoo - Optional)</label>
                <input
                  placeholder="Mata duree beeksisaa Afaan Oromootiin..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  value={formData.titleOm}
                  onChange={e => setFormData({...formData, titleOm: e.target.value})}
                />
              </div>
            </div>
          </div>

          <ImageUpload
            label="Cover Image (Cloudflare R2)"
            folder="posts"
            value={formData.imageUrl}
            onChange={url => setFormData({...formData, imageUrl: url})}
          />

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Content Details (English) *</label>
              <textarea
                required
                placeholder="Write the full announcement text for clients and salon guests in English..."
                className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                rows={3}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ዝርዝር ይዘት (አማርኛ - Optional)</label>
                <textarea
                  placeholder="የማስታወቂያ ዝርዝር በአማርኛ..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  rows={3}
                  value={formData.contentAm}
                  onChange={e => setFormData({...formData, contentAm: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Qabiyyee (Afaan Oromoo - Optional)</label>
                <textarea
                  placeholder="Qabiyyee beeksisaa Afaan Oromootiin..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  rows={3}
                  value={formData.contentOm}
                  onChange={e => setFormData({...formData, contentOm: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Publishing...' : '✨ Publish Now'}
            </Button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-gray-500 hover:text-gray-700 px-4 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
            <p className="text-3xl mb-2">📰</p>
            <p className="font-semibold text-gray-700">No announcements found matching this filter.</p>
            <p className="text-xs text-gray-400 mt-1">Staff posts and salon updates will appear here.</p>
          </div>
        ) : filteredPosts.map((news: any) => {
          const isActive = news.status === 'APPROVED';
          const authorName = news.author
            ? `${news.author.firstName || ''} ${news.author.lastName || ''}`.trim()
            : 'Salon Staff';
          const isStaffPost = news.author?.role === 'STAFF';

          return (
            <div
              key={news.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 bg-white ${
                isActive ? 'border-rose-100 shadow-sm hover:shadow-md' : 'border-gray-200 opacity-85 bg-gray-50/50'
              }`}
            >
              <div>
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-48 object-cover rounded-xl mb-3 border border-pink-100 shadow-xs"
                  />
                )}
                
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">{news.title}</h3>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full shrink-0 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isActive ? '● Active' : '○ Deactivated'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      isStaffPost
                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                        : 'bg-pink-50 text-pink-700 border border-pink-100'
                    }`}
                  >
                    {isStaffPost ? `Stylist: ${authorName}` : `Admin: ${authorName}`}
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

                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{news.content}</p>
              </div>

              {/* Admin Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleToggleStatus(news)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(news)}
                    className="px-3 py-1.5 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition-all cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Announcement Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-rose-100 shadow-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Edit Announcement</h3>
                <p className="text-xs text-gray-400">Admin authority: updates reflect immediately across the salon</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title (English) *</label>
                <input
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={editData.title}
                  onChange={e => setEditData({...editData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ርዕስ (አማርኛ)</label>
                  <input
                    placeholder="ርዕስ በአማርኛ..."
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    value={editData.titleAm}
                    onChange={e => setEditData({...editData, titleAm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mata Duree (Afaan Oromoo)</label>
                  <input
                    placeholder="Mata duree Afaan Oromootiin..."
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    value={editData.titleOm}
                    onChange={e => setEditData({...editData, titleOm: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <ImageUpload
              label="Cover Image (Cloudflare R2)"
              folder="posts"
              value={editData.imageUrl}
              onChange={url => setEditData(prev => ({...prev, imageUrl: url}))}
            />

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Content (English) *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={editData.content}
                  onChange={e => setEditData({...editData, content: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ዝርዝር (አማርኛ)</label>
                  <textarea
                    placeholder="ዝርዝር በአማርኛ..."
                    rows={3}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    value={editData.contentAm}
                    onChange={e => setEditData({...editData, contentAm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Qabiyyee (Afaan Oromoo)</label>
                  <textarea
                    placeholder="Qabiyyee Afaan Oromootiin..."
                    rows={3}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    value={editData.contentOm}
                    onChange={e => setEditData({...editData, contentOm: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                value={editData.status}
                onChange={e => setEditData({...editData, status: e.target.value})}
              >
                <option value="APPROVED">Active • Published (Visible to Clients)</option>
                <option value="REJECTED">Deactivated • Hidden (Internal Only)</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminNews;

