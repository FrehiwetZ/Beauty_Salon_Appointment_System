import React, { useState } from 'react';
import { UserProfile } from '../types/profile';
import Button from '../../../components/Button';

interface Props {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

function ProfileForm({ profile, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'newsletter' || name === 'smsAlerts') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-5 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-medium mb-1">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-medium mb-1">Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Address</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="newsletter"
                checked={formData.preferences.newsletter} 
                onChange={handleChange}
                className="w-4 h-4 text-pink-600 rounded border-gray-300" 
              />
              <span className="text-gray-700">Receive newsletter</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="smsAlerts"
                checked={formData.preferences.smsAlerts} 
                onChange={handleChange}
                className="w-4 h-4 text-pink-600 rounded border-gray-300" 
              />
              <span className="text-gray-700">Receive SMS alerts</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
