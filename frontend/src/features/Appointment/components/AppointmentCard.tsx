import React from 'react';
import { Appointment } from '../types/appointment';
import StatusBadge from '../../../components/StatusBadge';
import Button from '../../../components/Button';

interface Props {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}

function AppointmentCard({ appointment, onCancel }: Props) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-gray-800 text-lg">{appointment.serviceName}</h3>
        <p className="text-gray-500 text-sm mt-1">With {appointment.staffName}</p>
        <p className="text-gray-500 text-sm mt-1">
          <span className="font-medium text-gray-700">Date:</span> {appointment.date} at {appointment.time}
        </p>
      </div>
      
      <div className="flex flex-col items-start md:items-end gap-3">
        <StatusBadge status={appointment.status} />
        {appointment.status === 'Upcoming' && onCancel && (
          <Button onClick={() => onCancel(appointment.id)} variant="secondary" className="text-sm py-1.5 px-3">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;
