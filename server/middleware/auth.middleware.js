
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret'; // In production, use environment variable

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

export function isUser(req, res, next) {
  if (req.user.type !== 'user') {
    return res.status(403).json({ message: 'Access denied. User role required.' });
  }
  next();
}

export function isMerchant(req, res, next) {
  if (req.user.type !== 'merchant') {
    return res.status(403).json({ message: 'Access denied. Merchant role required.' });
  }
  next();
}
