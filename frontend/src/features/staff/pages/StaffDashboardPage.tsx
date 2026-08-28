import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { appointmentService } from '../../../services/appointment.service';
import { api } from '../../../services/api';

function StaffDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', bio: '', position: '' });
  
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [postData, setPostData] = useState({ title: '', content: '', imageUrl: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Appointments
        const aptRes = await appointmentService.getMyAppointments();
        if (aptRes.success) setAppointments(aptRes.data.data || aptRes.data);
        
        // Fetch Profile
        const profRes = await api.get(`/staff/${user?.id}`);
        if (profRes.data.success) {
          const staff = profRes.data.data;
          setProfile(staff);
          setProfileData({
            firstName: staff.firstName,
            lastName: staff.lastName,
            bio: staff.staffProfile?.bio || '',
            position: staff.staffProfile?.position || ''
          });
        }
        
        // Fetch Posts (Staff can see their own + published, but for simplicity let's just fetch all posts and filter by author)
        const postsRes = await api.get('/posts');
        if (postsRes.data.success) {
          const allPosts = postsRes.data.data.data || postsRes.data.data;
          setPosts(allPosts.filter((p: any) => p.author?.id === user?.id || p.authorId === user?.id));
        }
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
      const res = await api.post('/posts', { ...postData, status: 'PENDING' });
      if (res.data.success) {
        setPosts([res.data.data, ...posts]);
        setIsAddingPost(false);
        setPostData({ title: '', content: '', imageUrl: '' });
      }
    } catch (err) {
      alert('Failed to create post.');
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
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="First Name" className="p-2 border rounded" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} />
                <input required placeholder="Last Name" className="p-2 border rounded" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} />
                <input required placeholder="Position (Category)" className="p-2 border rounded col-span-2" value={profileData.position} onChange={e => setProfileData({...profileData, position: e.target.value})} />
              </div>
              <textarea required placeholder="Bio & Experience" className="w-full p-2 border rounded h-24" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <button type="button" onClick={() => setEditProfileMode(false)} className="text-gray-500 hover:underline">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="text-gray-600 space-y-2">
              <p><strong>Name:</strong> {profile?.firstName} {profile?.lastName}</p>
              <p><strong>Position:</strong> {profile?.staffProfile?.position || 'N/A'}</p>
              <p><strong>Bio:</strong> {profile?.staffProfile?.bio || 'N/A'}</p>
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
                    <th className="py-3 px-4 text-gray-600 font-medium">Customer</th>
                    <th className="py-3 px-4 text-gray-600 font-medium">Date & Time</th>
                    <th className="py-3 px-4 text-gray-600 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">{apt.service?.name}</td>
                      <td className="py-3 px-4">{apt.user?.firstName} {apt.user?.lastName}</td>
                      <td className="py-3 px-4">{apt.date} at {apt.startTime}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {apt.status}
                        </span>
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
            <form onSubmit={handleCreatePost} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <input required placeholder="Title" className="w-full p-2 border rounded" value={postData.title} onChange={e => setPostData({...postData, title: e.target.value})} />
              <input placeholder="Image URL (Optional)" className="w-full p-2 border rounded" value={postData.imageUrl} onChange={e => setPostData({...postData, imageUrl: e.target.value})} />
              <textarea required placeholder="Content" className="w-full p-2 border rounded h-24" value={postData.content} onChange={e => setPostData({...postData, content: e.target.value})} />
              <div className="flex gap-2">
                <Button type="submit">Submit for Approval</Button>
                <button type="button" onClick={() => setIsAddingPost(false)} className="text-gray-500 hover:underline">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.length === 0 ? (
              <p className="text-gray-500">You haven't authored any posts.</p>
            ) : posts.map(post => (
              <div key={post.id} className="border border-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{post.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${post.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.content}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default StaffDashboardPage;
