import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../context/NavigationContext';
import { authService } from '../../../services/auth.service';

interface Props {
  onGoToLogin: () => void;
}

function RegisterPage({ onGoToLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const { setPage, redirectAfterLogin, setRedirectAfterLogin } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        // Automatically login after successful registration could be done here, 
        // but for now let's just go to login or automatically use the new user if your backend returns a token on register
        onGoToLogin();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle={redirectAfterLogin ? "Sign up to book your appointment." : "Sign up to book your next appointment."}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-medium mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>
        
        <div className="pt-2">
          <Button type="submit" className="w-full justify-center">Sign Up</Button>
        </div>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <button onClick={onGoToLogin} className="text-pink-600 hover:underline font-medium">
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
