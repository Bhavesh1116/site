import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Mail, Lock, AlertCircle, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      loginSuccess(response.user);
      
      // Redirect based on role
      if (response.user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto h-16 w-16 bg-ppms-blue rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
          <Briefcase className="h-10 w-10 text-white" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">PPMS Spend Tracker</h2>
        <p className="mt-2 text-sm text-gray-600">Secure Employee Expense Management</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-ppms-blue">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
             <h3 className="text-xl font-bold text-gray-800">Sign In</h3>
             <p className="text-sm text-gray-500">Use your company credentials</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <Input
            label="Username / Email"
            type="email"
            placeholder="e.g. pintu@ppms"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="h-5 w-5" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="h-5 w-5" />}
          />

          <Button type="submit" className="w-full h-12 text-lg shadow-lg" isLoading={loading}>
            Secure Login
          </Button>

          <div className="mt-4 text-center">
             <p className="text-xs text-gray-400">
               For access issues, contact System Administrator.
             </p>
             <div className="mt-3 space-y-1 bg-gray-50 p-3 rounded-md border border-gray-100">
                <p className="text-xs text-gray-600">
                  <span className="font-bold text-ppms-blue">Employee:</span> pintu@ppms / pintu@1234
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-bold text-ppms-blue">Admin:</span> admin@ppms / admin@1234
                </p>
             </div>
          </div>
        </form>
      </Card>
    </div>
  );
};