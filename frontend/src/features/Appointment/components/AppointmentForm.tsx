import React, { useState } from 'react';
import Button from '../../../components/Button';
import { useData } from '../../../context/DataContext';

interface Props {
  onSubmit: (data: { serviceId: string; staffId: string; date: string; time: string }) => void;
  onCancel: () => void;
  initialServiceId?: number | string | null;
}

function AppointmentForm({ onSubmit, onCancel, initialServiceId }: Props) {
  const { services, staffList } = useData();
  
  const [serviceId, setServiceId] = useState(initialServiceId || (services.length > 0 ? services[0].id : ''));
  const [staffId, setStaffId] = useState(staffList.length > 0 ? staffList[0].id : '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ serviceId: String(serviceId), staffId: String(staffId), date, time });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book New Appointment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Service</label>
          <select 
            value={serviceId} 
            onChange={(e) => setServiceId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
          >
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Staff</label>
          <select 
            value={staffId} 
            onChange={(e) => setStaffId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
          >
            {staffList.map(s => (
              <option key={s.id} value={s.id}>{s.user?.firstName} {s.user?.lastName}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Time</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
          <Button type="submit">Book Now</Button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
