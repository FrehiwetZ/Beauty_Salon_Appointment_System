import React, { useState } from 'react';
import Button from '../../../components/Button';
import ImageUpload from '../../../components/ImageUpload';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { useLanguage } from '../../../context/LanguageContext';
import { Service } from '../../services/types/service';

function AdminServices() {
  const { services, addService, updateService, deleteService } = useData();
  const { success, error: toastError } = useToast();
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameAm: '',
    nameOm: '',
    category: 'Hair',
    categoryAm: '',
    categoryOm: '',
    price: '',
    duration: '',
    description: '',
    descriptionAm: '',
    descriptionOm: '',
    imageUrl: ''
  });

  // Edit Service State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    nameAm: '',
    nameOm: '',
    category: 'Hair',
    categoryAm: '',
    categoryOm: '',
    price: '',
    duration: '',
    description: '',
    descriptionAm: '',
    descriptionOm: '',
    imageUrl: ''
  });

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
      nameAm: formData.nameAm.trim() || undefined,
      nameOm: formData.nameOm.trim() || undefined,
      category: formData.category.trim() || undefined,
      categoryAm: formData.categoryAm.trim() || undefined,
      categoryOm: formData.categoryOm.trim() || undefined,
      price: priceNum,
      durationMinutes: durationNum,
      description: formData.description.trim() || undefined,
      descriptionAm: formData.descriptionAm.trim() || undefined,
      descriptionOm: formData.descriptionOm.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined
    };

    setIsSubmitting(true);
    try {
      await addService(newService);
      success("Service created successfully!");
      setIsAdding(false);
      setFormData({
        name: '',
        nameAm: '',
        nameOm: '',
        category: 'Hair',
        categoryAm: '',
        categoryOm: '',
        price: '',
        duration: '',
        description: '',
        descriptionAm: '',
        descriptionOm: '',
        imageUrl: ''
      });
    } catch (err: any) {
      toastError(err.response?.data?.message || err.message || "Failed to create service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setEditFormData({
      name: service.name || '',
      nameAm: (service as any).nameAm || '',
      nameOm: (service as any).nameOm || '',
      category: (service as any).category || 'Hair',
      categoryAm: (service as any).categoryAm || '',
      categoryOm: (service as any).categoryOm || '',
      price: String(service.price),
      duration: String((service as any).durationMinutes || (service as any).duration || ''),
      description: service.description || '',
      descriptionAm: (service as any).descriptionAm || '',
      descriptionOm: (service as any).descriptionOm || '',
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
      nameAm: editFormData.nameAm.trim() || undefined,
      nameOm: editFormData.nameOm.trim() || undefined,
      category: editFormData.category.trim() || undefined,
      categoryAm: editFormData.categoryAm.trim() || undefined,
      categoryOm: editFormData.categoryOm.trim() || undefined,
      price: priceNum,
      durationMinutes: durationNum,
      description: editFormData.description.trim() || undefined,
      descriptionAm: editFormData.descriptionAm.trim() || undefined,
      descriptionOm: editFormData.descriptionOm.trim() || undefined,
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
        <h2 className="text-xl font-bold text-gray-800">{t('admin.manageServices', 'Manage Services')}</h2>
        {!isAdding && <Button onClick={() => setIsAdding(true)}>+ {t('admin.addService', 'Add Service')}</Button>}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">{t('admin.addService', 'New Service')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name (EN) *</label>
              <input required placeholder="e.g. Haircut & Styling" className="w-full p-2.5 border rounded-lg bg-white text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ስም (አማርኛ - Optional)</label>
              <input placeholder="ለምሳሌ፡ የፀጉር አቆራረጥ እና ስታይል" className="w-full p-2.5 border rounded-lg bg-white text-sm" value={formData.nameAm} onChange={e => setFormData({...formData, nameAm: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Maqaa (Afaan Oromoo - Optional)</label>
              <input placeholder="Fkn: Rifeensa Muraa fi Tolchuu" className="w-full p-2.5 border rounded-lg bg-white text-sm" value={formData.nameOm} onChange={e => setFormData({...formData, nameOm: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
              <select className="w-full p-2.5 border rounded-lg bg-white text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Hair">Hair (ፀጉር / Rifeensa)</option>
                <option value="Nails">Nails (ጥፍር / Qubee)</option>
                <option value="Makeup">Makeup (ሜካፕ / Kuula)</option>
                <option value="Face">Face (ፊት / Fuula)</option>
                <option value="Other">Other (ሌላ / Kan biroo)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (ETB) *</label>
              <input required type="number" placeholder="Price in ETB" className="w-full p-2.5 border rounded-lg bg-white text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Mins) *</label>
              <input required placeholder="Duration in mins (e.g. 60)" className="w-full p-2.5 border rounded-lg bg-white text-sm" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            </div>
          </div>

          <div className="col-span-2">
            <ImageUpload
              label="Service Image (Cloudflare R2)"
              folder="services"
              value={formData.imageUrl}
              onChange={url => setFormData({...formData, imageUrl: url})}
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description (English) *</label>
              <textarea required placeholder="Full description in English..." className="w-full p-2.5 border rounded-lg bg-white text-sm" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">መግለጫ (አማርኛ - Optional)</label>
                <textarea placeholder="የአገልግሎት ዝርዝር መግለጫ በአማርኛ..." className="w-full p-2.5 border rounded-lg bg-white text-sm" rows={2} value={formData.descriptionAm} onChange={e => setFormData({...formData, descriptionAm: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ibsa (Afaan Oromoo - Optional)</label>
                <textarea placeholder="Ibsa tajaajilaa Afaan Oromootiin..." className="w-full p-2.5 border rounded-lg bg-white text-sm" rows={2} value={formData.descriptionOm} onChange={e => setFormData({...formData, descriptionOm: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : t('common.save', 'Save Service')}</Button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-500 hover:underline px-3 text-sm">{t('common.cancel', 'Cancel')}</button>
          </div>
        </form>
      )}
      {/* Mobile card view */}
      <div className="md:hidden space-y-3 mb-4">
        {services.map(service => (
          <div key={service.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.name} className="w-12 h-12 object-cover rounded-lg border border-pink-100 shadow-xs flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {service.name[0]}
              </div>
            )}
            <div className="flex-grow min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{service.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{(service as any).category || 'Service'} · {service.price} ETB · {(service as any).duration || (service as any).durationMinutes} mins</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => handleEditClick(service)} className="text-blue-600 text-xs font-medium cursor-pointer">{t('common.edit', 'Edit')}</button>
                <button onClick={() => handleDelete(service)} className="text-red-600 text-xs font-medium cursor-pointer">{t('common.delete', 'Delete')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">{t('common.name', 'Name')}</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Category</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Price (ETB)</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Duration</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-right">{t('appointments.actions', 'Actions')}</th>
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
                <td className="py-3 px-4 text-sm text-gray-600">{service.price} ETB</td>
                <td className="py-3 px-4 text-sm text-gray-600">{(service as any).duration || (service as any).durationMinutes} mins</td>
                <td className="py-3 px-4 text-sm text-right space-x-2">
                  <button onClick={() => handleEditClick(service)} className="text-blue-600 hover:underline font-medium">{t('common.edit', 'Edit')}</button>
                  <button onClick={() => handleDelete(service)} className="text-red-600 hover:underline font-medium">{t('common.delete', 'Delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 text-lg">{t('common.edit', 'Edit Service')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name (EN) *</label>
                <input required placeholder="Name (English)" className="w-full p-2.5 border rounded-lg text-sm" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ስም (አማርኛ)</label>
                <input placeholder="ስም በአማርኛ" className="w-full p-2.5 border rounded-lg text-sm" value={editFormData.nameAm} onChange={e => setEditFormData({...editFormData, nameAm: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Maqaa (Afaan Oromoo)</label>
                <input placeholder="Maqaa Afaan Oromootiin" className="w-full p-2.5 border rounded-lg text-sm" value={editFormData.nameOm} onChange={e => setEditFormData({...editFormData, nameOm: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={editFormData.category} onChange={e => setEditFormData({...editFormData, category: e.target.value})}>
                  <option value="Hair">Hair (ፀጉር / Rifeensa)</option>
                  <option value="Nails">Nails (ጥፍር / Qubee)</option>
                  <option value="Makeup">Makeup (ሜካፕ / Kuula)</option>
                  <option value="Face">Face (ፊት / Fuula)</option>
                  <option value="Other">Other (ሌላ / Kan biroo)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Price (ETB) *</label>
                <input required type="number" placeholder="Price (ETB)" className="w-full p-2.5 border rounded-lg text-sm" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Mins) *</label>
                <input required placeholder="Duration in mins" className="w-full p-2.5 border rounded-lg text-sm" value={editFormData.duration} onChange={e => setEditFormData({...editFormData, duration: e.target.value})} />
              </div>
            </div>

            <div className="col-span-2">
              <ImageUpload
                label="Service Image (Cloudflare R2)"
                folder="services"
                value={editFormData.imageUrl}
                onChange={url => setEditFormData({...editFormData, imageUrl: url})}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description (English) *</label>
                <textarea required placeholder="Description (English)" className="w-full p-2.5 border rounded-lg text-sm" rows={2} value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">መግለጫ (አማርኛ)</label>
                  <textarea placeholder="የአገልግሎት ዝርዝር መግለጫ በአማርኛ..." className="w-full p-2.5 border rounded-lg text-sm" rows={2} value={editFormData.descriptionAm} onChange={e => setEditFormData({...editFormData, descriptionAm: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ibsa (Afaan Oromoo)</label>
                  <textarea placeholder="Ibsa tajaajilaa Afaan Oromootiin..." className="w-full p-2.5 border rounded-lg text-sm" rows={2} value={editFormData.descriptionOm} onChange={e => setEditFormData({...editFormData, descriptionOm: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setEditingService(null)} className="text-gray-500 hover:underline px-3 text-sm">{t('common.cancel', 'Cancel')}</button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : t('common.save', 'Save Changes')}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminServices;

