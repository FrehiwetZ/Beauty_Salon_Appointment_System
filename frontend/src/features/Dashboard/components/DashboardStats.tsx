import React from 'react';
import { DashboardStats as DashboardStatsType } from '../types/dashboard';

interface Props {
  stats: DashboardStatsType;
}

function DashboardStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
        <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalAppointments}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
        <p className="text-gray-500 text-sm font-medium">Upcoming</p>
        <p className="text-3xl font-bold text-pink-600 mt-2">{stats.upcomingAppointments}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
        <p className="text-gray-500 text-sm font-medium">Completed Services</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completedServices}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
        <p className="text-gray-500 text-sm font-medium">Active Integrations</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeIntegrations}</p>
      </div>
    </div>
  );
}

export default DashboardStats;
