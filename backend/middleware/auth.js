import jwt from 'jsonwebtoken';

// Utility function to verify token (used by Socket.IO)
export const verifyTokenUtil = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Express middleware for HTTP requests
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyTokenUtil(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if user is admin
// export const isAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admin role required.' });
//   }
//   next();
// };

// // Check if user is buyer
// export const isBuyer = (req, res, next) => {
//   if (req.user.role !== 'buyer') {
//     return res.status(403).json({ message: 'Access denied. Buyer role required.' });
//   }
//   next();
// };

export const authorize=(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return res.status(403).json({
        message: `Access denied}`
      });
    }
    next();
  }
}


