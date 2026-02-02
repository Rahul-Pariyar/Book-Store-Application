// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useCallback,
// } from 'react';
// import * as authAPI from '../services/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Restore auth state on app load
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('token');

//         if (token && storedUser) {
//           setUser(JSON.parse(storedUser));
//         } else {
//           setUser(null);
//         }
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   const signup = useCallback(async (name, email, password, role = 'buyer') => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await authAPI.signup(name, email, password, role);

//       // signup does NOT auto-login (explicit behavior)
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


//   const updateUser = useCallback(async (updatedData) => {
//   setLoading(true);
//   setError(null);

//   try {
//     const userId = user?._id || user?.id;

//     if (!userId) {
//       throw new Error("User ID not found");
//     }

//     const response = await authAPI.updateProfile(userId, updatedData);

//     // Update local state and localStorage
//     setUser(response.data.user);
//     localStorage.setItem('user', JSON.stringify(response.data.user));

//     return response.data.user;
//   } catch (err) {
//     const errorMsg = err.response?.data?.message || 'Update failed';
//     setError(errorMsg);
//     throw err;
//   } finally {
//     setLoading(false);
//   }
// }, [user]);


//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     signup,
//     logout,
//     updateUser,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     isBuyer: user?.role === 'buyer',
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authAPI from '../services/api';

const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Signup
  const signup = useCallback(async (name, email, password, role = 'buyer') => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup(name, email, password, role);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
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
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Update user
  const updateUser = useCallback(
    async (updatedData) => {
      if (!user?.id && !user?._id) throw new Error('User ID not found');

      setLoading(true);
      setError(null);

      try {
        const userId = user._id || user.id;
        const response = await authAPI.updateProfile(userId, updatedData);

        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data.user;
      } catch (err) {
        const msg = err.response?.data?.message || 'Update failed';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBuyer: user?.role === 'buyer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};