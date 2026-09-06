import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../context/NavigationContext';
import { useLanguage } from '../../../context/LanguageContext';
import { authService } from '../../../services/auth.service';

interface Props {
  onGoToRegister: () => void;
}

function LoginPage({ onGoToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { setPage, redirectAfterLogin, setRedirectAfterLogin } = useNavigation();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('auth.validCredentialsError'));
      return;
    }

    try {
      // Actually login via the API
      const response = await authService.login({ username: email, password });
      if (response.success) {
        login(response.data.token, response.data.user);
        
        if (redirectAfterLogin) {
          setPage(redirectAfterLogin);
          setRedirectAfterLogin(null);
        } else if (response.data.user.role === 'ADMIN') {
          setPage('admin');
        } else if (response.data.user.role === 'STAFF') {
          setPage('staff-dashboard');
        } else {
          setPage('dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.loginFailed'));
    }
  };

  return (
    <AuthLayout 
      title={t('auth.welcomeBack')} 
      subtitle={redirectAfterLogin ? t('auth.signInToContinue') : t('auth.enterDetailsToSignIn')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">{t('auth.emailOrUsername')}</label>
          <input 
            type="text" 
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
          <Button type="submit" className="w-full justify-center">{t('auth.signIn')}</Button>
        </div>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        {t('auth.noAccount')}{' '}
        <button onClick={onGoToRegister} className="text-pink-600 hover:underline font-medium cursor-pointer">
          {t('auth.signUp')}
        </button>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
