import React from 'react';
import { UserProfile } from '../types/profile';
import Button from '../../../components/Button';

interface Props {
  profile: UserProfile;
  onEdit: () => void;
}

function ProfileDetails({ profile, onEdit }: Props) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <Button onClick={onEdit} variant="secondary">Edit Profile</Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">First Name</p>
            <p className="text-gray-800 mt-1">{profile.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Last Name</p>
            <p className="text-gray-800 mt-1">{profile.lastName}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 font-medium">Email Address</p>
          <p className="text-gray-800 mt-1">{profile.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 font-medium">Phone Number</p>
          <p className="text-gray-800 mt-1">{profile.phone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 font-medium">Address</p>
          <p className="text-gray-800 mt-1">{profile.address}</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" readOnly checked={profile.preferences.newsletter} className="w-4 h-4 text-pink-600 rounded border-gray-300" />
              <span className="text-gray-700">Receive newsletter</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" readOnly checked={profile.preferences.smsAlerts} className="w-4 h-4 text-pink-600 rounded border-gray-300" />
              <span className="text-gray-700">Receive SMS alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
