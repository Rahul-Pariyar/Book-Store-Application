import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Get user-specific cart key
  const getCartKey = () => {
    return user ? `cart_${user._id || user.id}` : 'cart_guest';
  };

  // Load cart from localStorage on user change
  useEffect(() => {
    const storedCart = localStorage.getItem(getCartKey());
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, [user]);

  const addToCart = useCallback((book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === book._id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...book, quantity: 1 }];
      }

      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, [user]);

  const removeFromCart = useCallback((bookId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== bookId);
      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, [user]);

  const updateQuantity = useCallback((bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === bookId ? { ...item, quantity } : item
      );
      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, [user, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(getCartKey());
  }, [user]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
