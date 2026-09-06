import React from 'react';
import { DashboardStats as DashboardStatsType } from '../types/dashboard';

interface Props {
  stats: DashboardStatsType;
}

function DashboardStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Appointments</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{stats.totalAppointments}</p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <p className="text-gray-500 text-xs sm:text-sm font-medium">Upcoming</p>
        <p className="text-2xl sm:text-3xl font-bold text-pink-600 mt-1 sm:mt-2">{stats.upcomingAppointments}</p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <p className="text-gray-500 text-xs sm:text-sm font-medium">Completed Services</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{stats.completedServices}</p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <p className="text-gray-500 text-xs sm:text-sm font-medium">Active Integrations</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{stats.activeIntegrations}</p>
      </div>
    </div>
  );
}

export default DashboardStats;
