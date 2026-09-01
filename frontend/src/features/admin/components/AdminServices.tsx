import React, { useState } from 'react';
import Button from '../../../components/Button';
import ImageUpload from '../../../components/ImageUpload';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { Service } from '../../services/types/service';

function AdminServices() {
  const { services, addService, updateService, deleteService } = useData();
  const { success, error: toastError } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', duration: '', description: '', imageUrl: '' });

  // Edit Service State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', category: '', price: '', duration: '', description: '', imageUrl: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError("Service name is required.");
      return;
    }
    const priceNum = parseFloat(formData.price);
    const durationNum = parseInt(formData.duration);

    if (isNaN(priceNum) || priceNum <= 0) {
      toastError("Price must be a valid positive number.");
      return;
    }
    if (isNaN(durationNum) || durationNum <= 0) {
      toastError("Duration must be a valid positive number in minutes.");
      return;
    }

    const newService = {
      name: formData.name.trim(),
      category: formData.category.trim() || undefined,
      price: priceNum,
      durationMinutes: durationNum,
      description: formData.description.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined
    };

    setIsSubmitting(true);
    try {
      await addService(newService);
      success("Service created successfully!");
      setIsAdding(false);
      setFormData({ name: '', category: '', price: '', duration: '', description: '', imageUrl: '' });
    } catch (err: any) {
      toastError(err.response?.data?.message || err.message || "Failed to create service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setEditFormData({
      name: service.name,
      category: (service as any).category || '',
      price: String(service.price),
      duration: String((service as any).durationMinutes || (service as any).duration || ''),
      description: service.description || '',
      imageUrl: service.imageUrl || ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const priceNum = parseFloat(editFormData.price);
    const durationNum = parseInt(editFormData.duration);

    if (isNaN(priceNum) || priceNum <= 0) {
      toastError("Price must be a valid positive number.");
      return;
    }
    if (isNaN(durationNum) || durationNum <= 0) {
      toastError("Duration must be a valid positive number in minutes.");
      return;
    }

    const updated = {
      ...editingService,
      name: editFormData.name.trim(),
      category: editFormData.category.trim() || undefined,
      price: priceNum,
      durationMinutes: durationNum,
      description: editFormData.description.trim() || undefined,
      imageUrl: editFormData.imageUrl.trim() || undefined
    };

    setIsSubmitting(true);
    try {
      await updateService(updated);
      success("Service updated successfully!");
      setEditingService(null);
    } catch (err: any) {
      toastError(err.response?.data?.message || err.message || "Failed to update service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete service "${service.name}"? This will also remove its bookings and stylist assignments.`)) return;
    try {
      await deleteService(String(service.id));
      success("Service deleted successfully!");
    } catch (err: any) {
      toastError(err.response?.data?.message || err.message || "Failed to delete service.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Services</h2>
        {!isAdding && <Button onClick={() => setIsAdding(true)}>+ Add Service</Button>}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">New Service</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Name" className="p-2.5 border rounded-lg bg-white text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="Category" className="p-2.5 border rounded-lg bg-white text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <input required type="number" placeholder="Price ($)" className="p-2.5 border rounded-lg bg-white text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <input required placeholder="Duration in mins (e.g. 60)" className="p-2.5 border rounded-lg bg-white text-sm" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            <div className="col-span-2">
              <ImageUpload
                label="Service Image (Cloudflare R2)"
                folder="services"
                value={formData.imageUrl}
                onChange={url => setFormData({...formData, imageUrl: url})}
              />
            </div>
          </div>
          <textarea required placeholder="Description" className="w-full p-2.5 border rounded-lg bg-white text-sm" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Save Service"}</Button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-500 hover:underline px-3 text-sm">Cancel</button>
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
                <td className="py-3 px-4 text-sm font-medium text-gray-800 flex items-center gap-3">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} className="w-9 h-9 object-cover rounded-lg border border-pink-100 shadow-xs" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center font-bold text-xs">
                      {service.name[0]}
                    </div>
                  )}
                  <span>{service.name}</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{(service as any).category || 'Service'}</td>
                <td className="py-3 px-4 text-sm text-gray-600">${service.price}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{(service as any).duration || (service as any).durationMinutes} mins</td>
                <td className="py-3 px-4 text-sm text-right space-x-2">
                  <button onClick={() => handleEditClick(service)} className="text-blue-600 hover:underline font-medium">Edit</button>
                  <button onClick={() => handleDelete(service)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 text-lg">Edit Service</h3>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Name" className="p-2.5 border rounded-lg text-sm" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
              <input required placeholder="Category" className="p-2.5 border rounded-lg text-sm" value={editFormData.category} onChange={e => setEditFormData({...editFormData, category: e.target.value})} />
              <input required type="number" placeholder="Price ($)" className="p-2.5 border rounded-lg text-sm" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} />
              <input required placeholder="Duration in mins" className="p-2.5 border rounded-lg text-sm" value={editFormData.duration} onChange={e => setEditFormData({...editFormData, duration: e.target.value})} />
              <div className="col-span-2">
                <ImageUpload
                  label="Service Image (Cloudflare R2)"
                  folder="services"
                  value={editFormData.imageUrl}
                  onChange={url => setEditFormData({...editFormData, imageUrl: url})}
                />
              </div>
            </div>
            <textarea required placeholder="Description" className="w-full p-2.5 border rounded-lg text-sm" rows={3} value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} />
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setEditingService(null)} className="text-gray-500 hover:underline px-3 text-sm">Cancel</button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminServices;

