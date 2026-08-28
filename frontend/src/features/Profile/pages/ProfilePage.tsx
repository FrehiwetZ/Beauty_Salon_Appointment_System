import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProfileDetails from '../components/ProfileDetails';
import ProfileForm from '../components/ProfileForm';
import { mockProfile } from '../data/mockProfile';
import { UserProfile } from '../types/profile';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../context/NavigationContext';

function ProfilePage() {
  const { user, isAuthenticated, login } = useAuth();
  const { setPage } = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Create a profile object based on the authenticated user
  const initialProfile: UserProfile = {
    ...mockProfile,
    id: user?.id || mockProfile.id,
    email: user?.email || mockProfile.email,
    firstName: user?.name?.split(' ')[0] || mockProfile.firstName,
    lastName: user?.name?.split(' ').slice(1).join(' ') || mockProfile.lastName,
  };

  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  useEffect(() => {
    if (!isAuthenticated) {
      setPage('login');
    }
  }, [isAuthenticated, setPage]);

  const handleSave = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    
    // Update the AuthContext user to reflect name/email changes
    if (user) {
      login({
        ...user,
        email: updatedProfile.email,
        name: `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim()
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <p className="text-pink-600 font-medium">My Account</p>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">User Profile</h1>
          <p className="text-gray-600 mt-3">
            Manage your personal information and preferences.
          </p>
        </div>

        {isEditing ? (
          <ProfileForm 
            profile={profile} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <ProfileDetails 
            profile={profile} 
            onEdit={() => setIsEditing(true)} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProfilePage;
