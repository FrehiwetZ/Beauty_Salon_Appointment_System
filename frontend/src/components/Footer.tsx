import React from 'react';

interface FooterProps {
  companyName?: string;
  className?: string;
}

export function Footer({ 
  companyName = "Beauty Salon", 
  className = "" 
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`
        bg-gray-900
        py-6
        text-center
        text-white
        ${className}
      `.trim()}
    >
      <p>© {currentYear} {companyName}. All rights reserved.</p>
    </footer>
  );
}

export default Footer;