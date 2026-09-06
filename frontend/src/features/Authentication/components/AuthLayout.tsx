import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useBranding } from '../../../context/BrandingContext';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

function AuthLayout({ children, title, subtitle }: Props) {
  const { salonName, tagline } = useBranding();

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-md border border-gray-100 w-full max-w-md mx-auto">
          {/* Official Salon Branding */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-500 text-white text-lg shadow-md shadow-pink-500/20 mb-2.5">
              ✨
            </div>
            <h2 className="font-serif font-bold text-2xl text-gray-900 tracking-tight leading-tight">
              {salonName}
            </h2>
            <p className="text-xs font-semibold text-pink-600 tracking-wide mt-1">
              {tagline}
            </p>
          </div>

          {/* Prominent Language Switcher */}
          <div className="mb-5">
            <LanguageSwitcher variant="auth" />
          </div>

          <div className="border-t border-gray-100 pt-4 text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AuthLayout;
