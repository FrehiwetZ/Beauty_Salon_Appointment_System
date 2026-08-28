import React, { useState } from 'react';
import Button from '../../../components/Button';
import { useData } from '../../../context/DataContext';
import { Service } from '../../Services/types/service';

function AdminServices() {
  const { services, addService, deleteService } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', duration: '', description: '', imageUrl: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newService = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      durationMinutes: parseInt(formData.duration),
      description: formData.description,
      imageUrl: formData.imageUrl
    };
    addService(newService);
    setIsAdding(false);
    setFormData({ name: '', category: '', price: '', duration: '', description: '', imageUrl: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Services</h2>
        {!isAdding && <Button onClick={() => setIsAdding(true)}>+ Add Service</Button>}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <h3 className="font-bold text-gray-800">New Service</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Name" className="p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="Category" className="p-2 border rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <input required type="number" placeholder="Price" className="p-2 border rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <input required placeholder="Duration (e.g. 60)" className="p-2 border rounded" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            <input placeholder="Image URL (Optional)" className="p-2 border rounded col-span-2" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          </div>
          <textarea required placeholder="Description" className="w-full p-2 border rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-500 hover:underline">Cancel</button>
          </div>
        </form>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Name</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Category</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Price</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Duration</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-800 flex items-center gap-2">
                  {service.imageUrl && <img src={service.imageUrl} alt={service.name} className="w-8 h-8 object-cover rounded-full" />}
                  {service.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{(service as any).category || 'Service'}</td>
                <td className="py-3 px-4 text-sm text-gray-600">${service.price}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{(service as any).duration || (service as any).durationMinutes} mins</td>
                <td className="py-3 px-4 text-sm text-right">
                  <button onClick={() => deleteService(service.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServices;
