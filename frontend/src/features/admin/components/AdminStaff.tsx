import React, { useState } from 'react';
import Button from '../../../components/Button';
import { useData } from '../../../context/DataContext';
import { Staff } from '../../staff/types/staff';

function AdminStaff() {
  const { staffList, addStaff, deleteStaff } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '', role: 'STAFF', specialty: '', experience: '', category: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = formData.name.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ' ';
    const username = formData.email.split('@')[0] + Math.floor(Math.random() * 100);

    const newStaff = {
      firstName,
      lastName,
      email: formData.email,
      username: username,
      password: formData.password,
      role: 'STAFF',
      bio: formData.specialty + ' ' + formData.experience,
      position: formData.category,
    };
    addStaff(newStaff);
    setIsAdding(false);
    setFormData({ name: '', email: '', username: '', password: '', role: 'STAFF', specialty: '', experience: '', category: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Staff</h2>
        {!isAdding && <Button onClick={() => setIsAdding(true)}>+ Add Staff</Button>}
      </div>
      
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <h3 className="font-bold text-gray-800">New Staff Member</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Full Name" className="p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email" className="p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required type="password" placeholder="Password" className="p-2 border rounded" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <input required placeholder="Specialty" className="p-2 border rounded" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
            <input required placeholder="Experience (e.g. 5 Years)" className="p-2 border rounded" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
            <input required placeholder="Category" className="p-2 border rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-500 hover:underline">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staffList.map(member => (
          <div key={member.id} className="border border-gray-100 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => deleteStaff(member.id)} className="text-red-600 hover:underline text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminStaff;
