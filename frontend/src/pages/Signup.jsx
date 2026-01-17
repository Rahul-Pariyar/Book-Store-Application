import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!email.includes('@')) errors.email = 'Please enter a valid email';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please fix the errors below');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await signup(name, email, password, 'buyer');
      toast.success('🎉 Account created successfully! Welcome aboard!', {
        position: 'top-right',
        autoClose: 2000,
      });
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">📚</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Our Community</h2>
            <p className="text-gray-600">Create an account to start shopping</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slideInLeft flex items-start">
              <span className="mr-3">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                }}
                placeholder="John Doe"
                className={`input-field ${fieldErrors.name ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                required
              />
              {fieldErrors.name && (
                <p className="text-red-600 text-sm mt-1">❌ {fieldErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                }}
                placeholder="you@example.com"
                className={`input-field ${fieldErrors.email ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-600 text-sm mt-1">❌ {fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                }}
                placeholder="••••••••"
                className={`input-field ${fieldErrors.password ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                required
              />
              {fieldErrors.password && (
                <p className="text-red-600 text-sm mt-1">❌ {fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                }}
                placeholder="••••••••"
                className={`input-field ${fieldErrors.confirmPassword ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">❌ {fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-center justify-center flex items-center gap-2 font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>✨ Create Account</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors">
              Login here
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          ✅ You'll be registered as a Buyer automatically
          </p>
    </div>
    </div>
  );
}
