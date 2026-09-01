import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/Button';
import ImageUpload from '../../../components/ImageUpload';
import { useAuth } from '../../../context/AuthContext';
import { appointmentService } from '../../../services/appointment.service';
import { api } from '../../../services/api';

function StaffDashboardPage() {
  const { user } = useAuth();
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

  const fetchPosts = async () => {
    try {
      const postsRes = await api.get('/posts');
      if (postsRes.data.success) {
        const allPosts = postsRes.data.data.data || postsRes.data.data;
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
    try {
      const res = await api.post('/posts', postData);
      if (res.data.success) {
        setPosts([res.data.data, ...posts]);
        setIsAddingPost(false);
        setPostData({ title: '', content: '', imageUrl: '' });
      }
    } catch (err) {
      alert('Failed to create post.');
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
    } catch (err) {
      alert('Failed to delete post.');
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
      const res = await api.patch(`/posts/${editingPost.id}`, editPostData);
      if (res.data.success) {
        setPosts(prev => prev.map(p => p.id === editingPost.id ? res.data.data : p));
        setEditingPost(null);
        alert('Announcement updated successfully!');
      }
    } catch (err) {
      alert('Failed to update post.');
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-6xl mx-auto px-5 py-12 space-y-12">
        <div className="text-center">
          <p className="text-pink-600 font-medium">Staff Portal</p>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">Welcome, {user?.firstName}</h1>
        </div>

        {/* Profile Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            {!editProfileMode && <Button onClick={() => setEditProfileMode(true)}>Edit Profile</Button>}
          </div>
          
          {editProfileMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="First Name" className="p-2 border rounded-lg text-sm" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} />
                <input required placeholder="Last Name" className="p-2 border rounded-lg text-sm" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} />
                <input required placeholder="Position (Category)" className="p-2 border rounded-lg text-sm md:col-span-2" value={profileData.position} onChange={e => setProfileData({...profileData, position: e.target.value})} />
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Profile Photo (Cloudflare R2)"
                    folder="staff"
                    value={profileData.imageUrl}
                    onChange={url => setProfileData(prev => ({...prev, imageUrl: url}))}
                  />
                </div>
              </div>
              <textarea required placeholder="Bio & Experience" className="w-full p-2 border rounded-lg text-sm h-24" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <button type="button" onClick={() => setEditProfileMode(false)} className="text-gray-500 hover:underline px-3 text-sm">Cancel</button>
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
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </div>
              )}
              <div className="text-gray-600 space-y-1 text-sm">
                <p><strong>Name:</strong> {profile?.firstName} {profile?.lastName}</p>
                <p><strong>Position:</strong> {profile?.staffProfile?.position || 'N/A'}</p>
                <p><strong>Bio:</strong> {profile?.staffProfile?.bio || 'N/A'}</p>
              </div>
            </div>
          )}
        </section>

        {/* Appointments Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">You have no upcoming appointments.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-600 font-medium">Service</th>
                    <th className="py-3 px-4 text-gray-600 font-medium">Customer Info</th>
                    <th className="py-3 px-4 text-gray-600 font-medium">Date & Time</th>
                    <th className="py-3 px-4 text-gray-600 font-medium">Details/Notes</th>
                    <th className="py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="py-3 px-4 text-gray-600 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">{apt.service?.name}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{apt.customerName || `${apt.user?.firstName || 'User'} ${apt.user?.lastName || ''}`}</div>
                        <div className="text-xs text-gray-500">{apt.customerPhone || 'No Phone'}</div>
                      </td>
                      <td className="py-3 px-4">{apt.date} at {apt.startTime}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{apt.notes || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {(apt.status === 'PENDING' || apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS') && (
                          <button
                            onClick={() => handleMarkCompleted(apt.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                          >
                            Job Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Posts Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Announcements</h2>
            {!isAddingPost && <Button onClick={() => setIsAddingPost(true)}>+ Create Post</Button>}
          </div>

          {isAddingPost && (
            <form onSubmit={handleCreatePost} className="mb-8 p-5 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">New Announcement</h3>
              <input required placeholder="Announcement Title" className="w-full p-2.5 border rounded-lg bg-white text-sm" value={postData.title} onChange={e => setPostData({...postData, title: e.target.value})} />
              <ImageUpload
                label="Announcement Image (Cloudflare R2)"
                folder="posts"
                value={postData.imageUrl}
                onChange={url => setPostData(prev => ({...prev, imageUrl: url}))}
              />
              <textarea required placeholder="Write announcement details..." className="w-full p-2.5 border rounded-lg bg-white text-sm" rows={4} value={postData.content} onChange={e => setPostData({...postData, content: e.target.value})} />
              <div className="flex gap-2">
                <Button type="submit">Publish Post</Button>
                <button type="button" onClick={() => setIsAddingPost(false)} className="text-gray-500 hover:underline px-3 text-sm">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.length === 0 ? (
              <p className="text-gray-500">You haven't authored any posts.</p>
            ) : posts.map(post => (
              <div key={post.id} className="border border-gray-100 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow bg-white">
                <div>
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-3 border border-pink-100" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{post.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${post.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => handleEditPostClick(post)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
                  <button onClick={() => handleDeletePost(post.id)} className="text-xs text-red-600 hover:underline font-medium">Delete</button>
                </div>
              </div>
            ))}
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
              <button type="button" onClick={() => setEditingPost(null)} className="text-gray-500 hover:underline px-3 text-sm">Cancel</button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default StaffDashboardPage;
