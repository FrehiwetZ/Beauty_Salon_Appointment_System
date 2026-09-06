import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/Button';
import ImageUpload from '../../../components/ImageUpload';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { appointmentService } from '../../../services/appointment.service';
import { api } from '../../../services/api';

function StaffDashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', bio: '', position: '', imageUrl: '' });
  
  // Post Creator
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [postData, setPostData] = useState({ title: '', content: '', imageUrl: '' });

  // Post Editor
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editPostData, setEditPostData] = useState({ title: '', content: '', imageUrl: '' });

  const [postError, setPostError] = useState<string | null>(null);
  const [postSubmitting, setPostSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const postsRes = await api.get('/posts?limit=100');
      if (postsRes.data.success) {
        const allPosts = postsRes.data.data.data || postsRes.data.data || [];
        setPosts(allPosts.filter((p: any) => p.author?.id === user?.id || p.authorId === user?.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApts = async () => {
    try {
      const aptRes = await appointmentService.getMyAppointments();
      if (aptRes.success) setAppointments(aptRes.data.data || aptRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchApts();
        
        // Fetch Profile
        const profRes = await api.get(`/staff/${user?.id}`);
        if (profRes.data.success) {
          const staff = profRes.data.data;
          setProfile(staff);
          setProfileData({
            firstName: staff.firstName || '',
            lastName: staff.lastName || '',
            bio: staff.staffProfile?.bio || '',
            position: staff.staffProfile?.position || '',
            imageUrl: staff.staffProfile?.imageUrl || staff.imageUrl || staff.image || ''
          });
        }
        
        await fetchPosts();
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.id) fetchData();
  }, [user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/staff/${user?.id}`, profileData);
      if (res.data.success) {
        setProfile(res.data.data);
        setEditProfileMode(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError(null);
    setPostSubmitting(true);
    try {
      const res = await api.post('/posts', {
        title: postData.title.trim(),
        content: postData.content.trim(),
        imageUrl: postData.imageUrl || null,
        status: 'APPROVED',
      });
      if (res.data.success) {
        setPosts([res.data.data, ...posts]);
        setIsAddingPost(false);
        setPostData({ title: '', content: '', imageUrl: '' });
      } else {
        setPostError(res.data.message || 'Failed to create post.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create post.';
      setPostError(msg);
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleToggleDeactivate = async (post: any) => {
    const newStatus = post.status === 'APPROVED' ? 'REJECTED' : 'APPROVED';
    const actionName = post.status === 'APPROVED' ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${actionName} this announcement?`)) return;
    try {
      const res = await api.patch(`/posts/${post.id}`, { status: newStatus });
      if (res.data.success) {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${actionName} announcement.`);
    }
  };

  const handleMarkCompleted = async (id: string) => {
    try {
      const res = await appointmentService.updateAppointmentStatus(id, 'COMPLETED');
      if (res.success) {
        await fetchApts();
        alert('Appointment marked as completed successfully!');
      }
    } catch (err) {
      alert('Failed to mark appointment as completed.');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await api.delete(`/posts/${id}`);
      if (res.data.success) {
        setPosts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post.');
    }
  };

  const handleEditPostClick = (post: any) => {
    setEditingPost(post);
    setEditPostData({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || ''
    });
  };

  const handleUpdatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      const res = await api.patch(`/posts/${editingPost.id}`, {
        title: editPostData.title.trim(),
        content: editPostData.content.trim(),
        imageUrl: editPostData.imageUrl || null,
      });
      if (res.data.success) {
        setPosts(prev => prev.map(p => p.id === editingPost.id ? res.data.data : p));
        setEditingPost(null);
        alert('Announcement updated successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update post.');
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-12 space-y-8 sm:space-y-12">
        <div className="text-center">
          <p className="text-pink-600 font-medium tracking-wide uppercase text-xs">{t('staffDash.title')}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-1">{t('dashboard.welcome')}, {user?.name || user?.firstName || t('nav.stylists')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('staffDash.subtitle')}</p>
        </div>

        {/* Profile Section */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-rose-100/70">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t('profile.title')}</h2>
              <p className="text-xs text-gray-400">{t('profile.subtitle')}</p>
            </div>
            {!editProfileMode && <Button onClick={() => setEditProfileMode(true)} size="sm">{t('common.edit')}</Button>}
          </div>
          
          {editProfileMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="First Name" className="p-3 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl text-sm transition-all" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} />
                <input required placeholder="Last Name" className="p-3 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl text-sm transition-all" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} />
                <input required placeholder="Position (e.g. Master Stylist, Colorist)" className="p-3 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl text-sm md:col-span-2 transition-all" value={profileData.position} onChange={e => setProfileData({...profileData, position: e.target.value})} />
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Profile Photo (Cloudflare R2)"
                    folder="staff"
                    value={profileData.imageUrl}
                    onChange={url => setProfileData(prev => ({...prev, imageUrl: url}))}
                  />
                </div>
              </div>
              <textarea required placeholder="Bio & Experience..." className="w-full p-3 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl text-sm h-28 transition-all" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
              <div className="flex gap-2 pt-2">
                <Button type="submit">{t('common.save')}</Button>
                <button type="button" onClick={() => setEditProfileMode(false)} className="text-gray-500 hover:text-gray-700 px-3 text-sm font-medium">{t('common.cancel')}</button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {(profile?.staffProfile?.imageUrl || profile?.imageUrl || profile?.image) ? (
                <img
                  src={profile?.staffProfile?.imageUrl || profile?.imageUrl || profile?.image}
                  alt={profile?.firstName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-pink-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-2xl">
                  {profile?.firstName?.[0] || 'S'}{profile?.lastName?.[0] || ''}
                </div>
              )}
              <div className="text-gray-600 space-y-1 text-sm">
                <p><strong className="text-gray-800">Name:</strong> {profile?.firstName} {profile?.lastName}</p>
                <p><strong className="text-gray-800">Position:</strong> {profile?.staffProfile?.position || 'Stylist'}</p>
                <p><strong className="text-gray-800">Bio:</strong> {profile?.staffProfile?.bio || 'Master salon artisan specializing in luxury haircare and wellness styling.'}</p>
              </div>
            </div>
          )}
        </section>

        {/* Appointments Section */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-rose-100/70">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t('staffDash.myAppointments')}</h2>
              <p className="text-xs text-gray-400">{t('staffDash.appointmentsSubtitle')}</p>
            </div>
            <button onClick={fetchApts} className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
              🔄 {t('common.refresh')}
            </button>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              <p className="text-2xl mb-2">🗓️</p>
              <p>You have no appointments assigned at the moment.</p>
            </div>
          ) : (
            <>
              {/* Mobile card view */}
              <div className="md:hidden space-y-3">
                {appointments.map(apt => (
                  <div key={apt.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{apt.service?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{apt.date} at {apt.startTime}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : apt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">{apt.customerName || `${apt.user?.firstName || 'User'} ${apt.user?.lastName || ''}`}</span>
                      {apt.customerPhone && <span className="ml-2 text-gray-400">{apt.customerPhone}</span>}
                    </div>
                    {apt.notes && <p className="text-xs text-gray-400 italic">{apt.notes}</p>}
                    {(apt.status === 'PENDING' || apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS') && (
                      <button
                        onClick={() => handleMarkCompleted(apt.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer mt-1"
                      >
                        ✓ {t('common.done')}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop table view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                      <th className="py-3 px-4 font-semibold">{t('appointments.service')}</th>
                      <th className="py-3 px-4 font-semibold">{t('appointments.customer')}</th>
                      <th className="py-3 px-4 font-semibold">{t('appointments.dateTime')}</th>
                      <th className="py-3 px-4 font-semibold">{t('appointments.notes')}</th>
                      <th className="py-3 px-4 font-semibold">{t('appointments.status')}</th>
                      <th className="py-3 px-4 font-semibold text-right">{t('appointments.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {appointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-900">{apt.service?.name}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-800">{apt.customerName || `${apt.user?.firstName || 'User'} ${apt.user?.lastName || ''}`}</div>
                          <div className="text-xs text-gray-500">{apt.customerPhone || 'No Phone'}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{apt.date} at {apt.startTime}</td>
                        <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">{apt.notes || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : apt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {(apt.status === 'PENDING' || apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS') && (
                            <button
                              onClick={() => handleMarkCompleted(apt.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              ✓ {t('common.done')}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Posts Section */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-rose-100/70">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t('staffDash.myAnnouncements')}</h2>
              <p className="text-xs text-gray-400">{t('staffDash.announcementsSubtitle')}</p>
            </div>
            {!isAddingPost && (
              <Button onClick={() => { setIsAddingPost(true); setPostError(null); }} size="sm">
                + {t('staffDash.createAnnouncement')}
              </Button>
            )}
          </div>

          {isAddingPost && (
            <form onSubmit={handleCreatePost} className="mb-8 p-6 border border-pink-100 rounded-2xl bg-gradient-to-b from-pink-50/50 to-white shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                <h3 className="font-bold text-gray-800 text-lg">Create Announcement</h3>
                <span className="text-xs text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full font-medium">Published as {user?.name || 'Staff'}</span>
              </div>

              {postError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{postError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Announcement Title *</label>
                <input
                  required
                  placeholder="e.g. Autumn Balayage & Conditioning Special"
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  value={postData.title}
                  onChange={e => setPostData({...postData, title: e.target.value})}
                />
              </div>

              <ImageUpload
                label="Cover Image (Optional — Cloudflare R2)"
                folder="posts"
                value={postData.imageUrl}
                onChange={url => setPostData(prev => ({...prev, imageUrl: url}))}
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Details & Announcement Content *</label>
                <textarea
                  required
                  placeholder="Describe your special offer, new treatment styles, or announcements for salon clients..."
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  rows={4}
                  value={postData.content}
                  onChange={e => setPostData({...postData, content: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={postSubmitting}>
                  {postSubmitting ? 'Publishing...' : '✨ Publish Announcement'}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsAddingPost(false)}
                  className="text-gray-500 hover:text-gray-700 px-4 text-sm font-medium"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                <p className="text-3xl mb-2">📢</p>
                <p className="font-medium text-gray-600">You haven't authored any announcements yet.</p>
                <p className="text-xs text-gray-400 mt-1">Share offers and style updates with clients today.</p>
              </div>
            ) : posts.map(post => {
              const isActive = post.status === 'APPROVED';
              return (
                <div
                  key={post.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 bg-white ${
                    isActive ? 'border-rose-100 shadow-sm hover:shadow-md' : 'border-gray-200 opacity-85 bg-gray-50/50'
                  }`}
                >
                  <div>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-xl mb-3 border border-pink-100 shadow-xs"
                      />
                    )}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg leading-snug">{post.title}</h3>
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isActive ? '● Active' : '○ Deactivated'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{post.content}</p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleDeactivate(post)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {isActive ? '⏸ Deactivate' : '▶ Reactivate'}
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditPostClick(post)}
                        className="text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Edit Announcement Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleUpdatePostSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 text-lg">Edit Announcement</h3>
            <input required placeholder="Title" className="w-full p-2.5 border rounded-lg text-sm" value={editPostData.title} onChange={e => setEditPostData({...editPostData, title: e.target.value})} />
            
            <ImageUpload
              label="Announcement Image (Cloudflare R2)"
              folder="posts"
              value={editPostData.imageUrl}
              onChange={url => setEditPostData(prev => ({...prev, imageUrl: url}))}
            />

            <textarea required placeholder="Content" className="w-full p-2.5 border rounded-lg text-sm" rows={4} value={editPostData.content} onChange={e => setEditPostData({...editPostData, content: e.target.value})} />
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setEditingPost(null)} className="text-gray-500 hover:underline px-3 text-sm">{t('common.cancel')}</button>
              <Button type="submit">{t('common.save')}</Button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default StaffDashboardPage;
