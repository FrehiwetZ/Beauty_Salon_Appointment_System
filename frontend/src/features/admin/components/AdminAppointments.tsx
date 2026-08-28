import React from 'react';
import StatusBadge from '../../../components/StatusBadge';
import { useData } from '../../../context/DataContext';

function AdminAppointments() {
  const { appointments, updateAppointment } = useData();

  const handleStatusChange = (id: string, newStatus: 'Upcoming' | 'Completed' | 'Cancelled') => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      updateAppointment({ ...apt, status: newStatus });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">All Appointments</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Customer</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Service</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Date & Time</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{apt.customerName}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{apt.serviceName}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{apt.date} @ {apt.time}</td>
                <td className="py-3 px-4 text-sm">
                  <StatusBadge status={apt.status} />
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  {apt.status === 'Upcoming' && (
                    <>
                      <button onClick={() => handleStatusChange(apt.id, 'Completed')} className="text-green-600 hover:underline mr-3">Complete</button>
                      <button onClick={() => handleStatusChange(apt.id, 'Cancelled')} className="text-red-600 hover:underline">Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAppointments;
