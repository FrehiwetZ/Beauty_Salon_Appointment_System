import React from 'react';
import AppointmentCard from './AppointmentCard';
import { Appointment } from '../types/appointment';

interface Props {
  appointments: Appointment[];
  onCancel?: (id: string) => void;
}

function AppointmentList({ appointments, onCancel }: Props) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} onCancel={onCancel} />
      ))}
    </div>
  );
}

export default AppointmentList;
