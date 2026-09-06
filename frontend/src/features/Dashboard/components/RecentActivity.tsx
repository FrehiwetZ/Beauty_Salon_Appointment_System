import React from 'react';
import { Activity } from '../types/dashboard';

interface Props {
  activities: Activity[];
}

function RecentActivity({ activities }: Props) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent activity.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <p className="text-gray-800 font-medium">{activity.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(activity.date).toLocaleDateString()} - {new Date(activity.date).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
