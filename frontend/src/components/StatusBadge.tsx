import React from 'react';

// 1. Define the strictly allowed status values as a Union Type
export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';

// 2. Define the component's props interface
interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

// 3. Move lookup objects outside the component to prevent recreation on every re-render
const DOT_STYLES: Record<AppointmentStatus, string> = {
  Upcoming: 'bg-purple-500',
  Completed: 'bg-emerald-500',
  Cancelled: 'bg-red-500',
};

const COLOR_STYLES: Record<AppointmentStatus, string> = {
  Upcoming: 'bg-purple-100 text-purple-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  // Safely fallback to gray if an unexpected string bypasses TS
  const badgeColors = COLOR_STYLES[status] ?? 'bg-gray-100 text-gray-700';
  const dotColor = DOT_STYLES[status] ?? 'bg-gray-500';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-4 py-0.5 text-sm font-semibold
        ${badgeColors}
        ${className}
      `.trim()}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

export default StatusBadge;