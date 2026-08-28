import React from 'react';

// Define the component's props interface
interface AvatarProps {
  name?: string;
  className?: string; // Optional: allows custom styling overrides when used
}

export function Avatar({ name, className = "" }: AvatarProps) {
  return (
    <div
      className={`
        flex
        h-8 w-8
        items-center justify-center
        rounded-full
        bg-gradient-to-br from-pink-400 to-rose-500
        text-sm font-semibold text-white
        shadow-sm
        ${className}
      `.trim()}
    >
      {name?.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}

export default Avatar;