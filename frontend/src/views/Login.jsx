import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { useLoginMutation, useRegisterMutation } from '../store/api/apiSlice';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Viewer');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const isLoading = isLoginLoading || isRegisterLoading;
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password || (!isLogin && !name)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      if (isLogin) {
        const response = await loginMutation({ email, password }).unwrap();
        if (response?.status === 'success' && response?.data) {
          dispatch(setCredentials(response.data));
          navigate(from, { replace: true });
        } else {
          setErrorMessage('Failed to log in. Please check your credentials.');
        }
      } else {
        const response = await registerMutation({ name, email, password, role }).unwrap();
        if (response?.status === 'success' && response?.data) {
          dispatch(setCredentials(response.data));
          navigate(from, { replace: true });
        } else {
          setErrorMessage('Failed to register. Please try again.');
        }
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      setErrorMessage(
        err?.data?.message || err?.message || 'Authentication failed. Please verify your connection.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Inventory Management System
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isLogin ? 'Sign in' : 'Create new account'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-600"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              placeholder="Please enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase" htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-600"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase block">
                System Role Access
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Viewer')}
                  className={`py-1.5 border text-xs font-semibold ${role === 'Viewer'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  [Viewer - Read]
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`py-1.5 border text-xs font-semibold ${role === 'Admin'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  [Admin - Write]
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 text-sm border border-blue-650 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            {isLogin ? 'Create new account' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
