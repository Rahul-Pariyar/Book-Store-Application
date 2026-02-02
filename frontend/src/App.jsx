// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import Navbar from './components/Navbar';
// import ProtectedRoute from './components/ProtectedRoute';
// import Profile from './pages/Profile';

// // Auth Pages
// import Login from './pages/Login';
// import Signup from './pages/Signup';

// // Buyer Pages
// import Home from './pages/Home';
// import Cart from './pages/Cart';
// import MyOrders from './pages/MyOrders';

// // Admin Pages
// import AdminBooks from './pages/AdminBooks';
// import AdminUsers from './pages/AdminUsers';
// import AdminOrders from './pages/AdminOrders';

// import './index.css';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={true}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="light"
//           />
//           <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             <Navbar />
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />

//                {/* Profile Route */}
//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Buyer Routes */}
//               <Route
//                 path="/cart"
//                 element={
//                   <ProtectedRoute requiredRole="buyer">
//                     <Cart />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/my-orders"
//                 element={
//                   <ProtectedRoute requiredRole="buyer">
//                     <MyOrders />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Admin Routes */}
//               <Route
//                 path="/admin/books"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminBooks />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/admin/users"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminUsers />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/admin/orders"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminOrders />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Catch all */}
//               <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//           </div>
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import './index.css';

// Wrapper to ensure Navbar only renders after auth is loaded
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>; // You can replace with a spinner

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Buyer Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute requiredRole="buyer">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute requiredRole="buyer">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Payment Routes */}
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute requiredRole="buyer">
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-failure"
          element={
            <ProtectedRoute requiredRole="buyer">
              <PaymentFailure />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AppContent />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;