# BookStore Application - MERN Stack

A simple and minimal online bookstore application with JWT-based authentication and role-based access control (RBAC). Features include book management, shopping cart, and order processing with cash-on-delivery payment option.

# Features

## Admin Features
- CRUD operations for books (Create, Read, Update, Delete)
- Manage users (view, edit, delete)
- View all orders and update order status
- Role-based access control

## Buyer Features
- View all available books
- Add books to cart
- Manage cart (add, remove, update quantity)
- Checkout with delivery address
- Place orders (Cash on Delivery)
- View order history

## Security
- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control (Admin/Buyer)
- Protected routes on frontend and backend

# Tech Stack

## Backend
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- JWT- Token-based authentication
- bcryptjs - Password hashing

## Frontend
- React 18 - UI library
- Vite - Build tool
- React Router- Client-side routing
- Axios- HTTP client
- Tailwind CSS - CSS framework


# Key Features Implemented

1. JWT Authentication
   - Tokens expire in 7 days
   - Tokens stored in localStorage on client
   - Token sent with each request to protected endpoints

2. Password Security
   - Passwords hashed with bcryptjs (salt rounds: 10)
   - Original password never stored
   - Password comparison done securely

3. Cart Functionality
   - Cart data persisted in localStorage
   - Cart context manages state across app
   - Quantity updates with inventory check during checkout

4. Order Processing
   - Inventory management (reduces stock on order)
   - Order status tracking
   - Cash on Delivery payment option
   - Order history for buyers

5. Error Handling
   - Validation errors returned with meaningful messages
   - Token expiration handling
   - Stock availability checks

## Backend Summary

The backend of this application is designed with a strong focus on security, clean architecture, and real-world business logic. RESTful APIs are implemented using Express with a modular structure that separates routes, controllers, and models. JWT-based authentication and role-based authorization ensure secure access to protected resources. Core operations such as inventory management and order processing are handled server-side to maintain data integrity and scalability.