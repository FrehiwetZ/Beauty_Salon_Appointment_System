import React from 'react';
import { SystemStats } from '../types/admin';

interface Props {
  stats: SystemStats;
}

function DataOverview({ stats }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers.toLocaleString()}</p>
        </div>
        
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Active Sessions</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.activeSessions}</p>
        </div>
        
        <div className="p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Server Uptime</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.serverUptime}</p>
        </div>
      </div>
    </div>
  );
}

export default DataOverview;
