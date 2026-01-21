// import React, { createContext, useState, useCallback, useEffect } from 'react';
// import * as authAPI from '../services/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); //change
//   const [error, setError] = useState(null);

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const signup = useCallback(async (name, email, password, role = 'buyer') => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await authAPI.signup(name, email, password, role);
//       // localStorage.setItem('token', response.data.token);
//       // localStorage.setItem('user', JSON.stringify(response.data.user));
//       // setUser(response.data.user);
//       return response.data;
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Signup failed';
//       setError(errorMsg);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const login = useCallback(async (email, password) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await authAPI.login(email, password);
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       setUser(response.data.user);
//       return response.data;
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Login failed';
//       setError(errorMsg);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   }, []);

//   const value = {
//     user,
//     loading,
//     error,
//     signup,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     isBuyer: user?.role === 'buyer',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import * as authAPI from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signup = useCallback(async (name, email, password, role = 'buyer') => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup(name, email, password, role);

      // signup does NOT auto-login (explicit behavior)
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBuyer: user?.role === 'buyer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
