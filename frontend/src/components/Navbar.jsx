import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('👋 Logged out successfully!', {
      position: 'bottom-right',
      autoClose: 2000,
    });
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartCount = getTotalItems();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:text-blue-100 transition-colors">
          📚 <span className="hidden md:inline">BookStore</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="hover:text-blue-100 transition-colors font-medium">
            🏠 Home
          </Link>

          {isAuthenticated && user?.role === 'buyer' && (
            <>
              <Link to="/cart" className="hover:text-blue-100 transition-colors font-medium relative">
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/my-orders" className="hover:text-blue-100 transition-colors font-medium">
                📦 My Orders
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link to="/admin/books" className="hover:text-blue-100 transition-colors font-medium">
                📚 Books
              </Link>
              <Link to="/admin/users" className="hover:text-blue-100 transition-colors font-medium">
                👥 Users
              </Link>
              <Link to="/admin/orders" className="hover:text-blue-100 transition-colors font-medium">
                📊 Orders
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="flex gap-4 items-center border-l border-blue-400 pl-8">
              <Link
                to="/profile"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                👤 Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors btn-hover"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 border-l border-blue-400 pl-8">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-medium hover:text-blue-100 transition-colors"
              >
                🔓 Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors btn-hover"
              >
                ✨ Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1 w-8 h-8 justify-center items-center"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-4 space-y-3 animate-slideInLeft">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-blue-100 transition-colors font-medium py-2"
          >
            🏠 Home
          </Link>

          {isAuthenticated && user?.role === 'buyer' && (
            <>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-100 transition-colors font-medium py-2 relative"
              >
                🛒 Cart {cartCount > 0 && <span className="badge badge-danger ml-2">{cartCount}</span>}
              </Link>
              <Link
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-100 transition-colors font-medium py-2"
              >
                📦 My Orders
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link
                to="/admin/books"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-100 transition-colors font-medium py-2"
              >
                📚 Books
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-100 transition-colors font-medium py-2"
              >
                👥 Users
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-100 transition-colors font-medium py-2"
              >
                📊 Orders
              </Link>
            </>
          )}

          <div className="border-t border-blue-400 pt-3 mt-3">
            {isAuthenticated ? (
              <>
                <p className="text-sm font-semibold py-2">👤 {user?.name}</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg font-medium hover:text-blue-100 transition-colors text-center mb-2"
                >
                  🔓 Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
                >
                  ✨ Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
