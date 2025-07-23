import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Building, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    accessCode: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const toggleUserType = () => {
    setIsAdmin(prev => !prev);
    setCredentials({ email: '', accessCode: '', password: '' });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Prepare payload based on user type
      const payload = isAdmin 
        ? { email: credentials.email, password: credentials.password }
        : { accessCode: credentials.accessCode, password: credentials.password };

      const result = await login(payload, isAdmin ? 'admin' : 'institution');

      if (result.success) {
        // Redirect based on user role
        const redirectPath = result.redirectTo || (result.user.role === 'admin' ? '/admin/dashboard' : '/institution/dashboard');
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 overflow-hidden">
      {/* Green blurred background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-300 via-emerald-200 to-green-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-emerald-200 via-green-100 to-green-50 rounded-full blur-2xl opacity-50"></div>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`p-6 text-center ${isAdmin 
            ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-green-400' 
            : 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-400'
          }`}>
            <div className="flex justify-center mb-3">
              <div className="bg-white/30 p-3 rounded-full backdrop-blur-sm">
                {isAdmin ? (
                  <User className="h-6 w-6 text-white" />
                ) : (
                  <Building className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isAdmin ? 'Admin Portal' : 'Institution Portal'}
            </h2>
            <p className="text-green-100 mt-1">
              {isAdmin ? 'Sign in with admin credentials' : 'Sign in with your institution access code'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lock className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor={isAdmin ? 'email' : 'accessCode'} className="block text-sm font-medium text-gray-700 mb-1">
                  {isAdmin ? 'Email Address' : 'Institution Access Code'}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id={isAdmin ? 'email' : 'accessCode'}
                    name={isAdmin ? 'email' : 'accessCode'}
                    type={isAdmin ? 'email' : 'text'}
                    placeholder={isAdmin ? 'admin@example.com' : 'INST-XXXXXX-XXXX'}
                    value={isAdmin ? credentials.email : credentials.accessCode}
                    onChange={handleInputChange}
                    className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white/90"
                    required
                    autoComplete={isAdmin ? 'email' : 'organization'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white/90"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-green-500 hover:from-emerald-700 hover:to-green-600'
                    : 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 hover:from-green-700 hover:to-emerald-600'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                {isAdmin ? 'Not an admin?' : 'Admin access?'}{' '}
                <button
                  type="button"
                  onClick={toggleUserType}
                  className="font-medium text-green-700 hover:text-green-600 focus:outline-none transition-colors"
                >
                  {isAdmin ? 'Switch to institution login' : 'Switch to admin login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;