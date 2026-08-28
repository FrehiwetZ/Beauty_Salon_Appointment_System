import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-5">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 mt-2">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AuthLayout;
