import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import Button from '../../../components/Button';
import { useLanguage } from '../../../context/LanguageContext';
import { authService } from '../../../services/auth.service';

interface Props {
  onGoToLogin: () => void;
}

function RegisterPage({ onGoToLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const parts = name.trim().split(' ');
      const firstName = parts[0];
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

      const response = await authService.register({
        email,
        username,
        password,
        firstName,
        lastName
      });

      if (response.success) {
        onGoToLogin();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.registrationFailed'));
    }
  };

  return (
    <AuthLayout 
      title={t('auth.createAccount')} 
      subtitle={t('auth.joinUs')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">{t('common.name')}</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white text-gray-800"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">{t('auth.email')}</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white text-gray-800"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">{t('auth.password')}</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white text-gray-800"
            required
          />
        </div>
        
        <div className="pt-2">
          <Button type="submit" className="w-full justify-center">{t('auth.register')}</Button>
        </div>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        {t('auth.haveAccount')}{' '}
        <button onClick={onGoToLogin} className="text-pink-600 hover:underline font-medium cursor-pointer">
          {t('auth.signIn')}
        </button>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
