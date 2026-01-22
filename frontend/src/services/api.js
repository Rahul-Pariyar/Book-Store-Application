import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const signup = (name, email, password, role = 'buyer') =>
  api.post('/auth/signup', { name, email, password, role });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const getProfile = () => api.get('/auth/profile');

// Book APIs
export const getBooks = () => api.get('/books');

export const getBookById = (id) => api.get(`/books/${id}`);

export const createBook = (bookData) =>
  api.post('/books', bookData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateBook = (id, bookData) => api.put(`/books/${id}`, bookData,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteBook = (id) => api.delete(`/books/${id}`);

// Order APIs
export const createOrder = (orderData) => api.post('/orders', orderData);

export const getMyOrders = () => api.get('/orders/my-orders');

export const getAllOrders = () => api.get('/orders');

export const updateOrderStatus = (id, orderStatus) =>
  api.put(`/orders/${id}/status`, { orderStatus });

// User APIs
export const getAllUsers = () => api.get('/users');

export const getUserById = (id) => api.get(`/users/${id}`);

export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
