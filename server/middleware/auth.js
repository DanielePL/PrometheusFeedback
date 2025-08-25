const jwt = require('jsonwebtoken');
const { responses, UnauthorizedError } = require('../utils/helpers');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(responses.unauthorized('Kein Token bereitgestellt'));
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json(responses.unauthorized('Kein Token bereitgestellt'));
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not set in environment variables');
      return res.status(500).json(responses.error('Server-Konfigurationsfehler', 'CONFIG_ERROR'));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      // Check if token is expired (additional check)
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json(responses.unauthorized('Token abgelaufen'));
      }

      // Attach user info to request
      req.user = {
        role: decoded.role,
        timestamp: decoded.timestamp,
        exp: decoded.exp,
        iat: decoded.iat
      };

      // Check if user has admin role
      if (decoded.role !== 'admin') {
        return res.status(403).json(responses.forbidden('Admin-Berechtigung erforderlich'));
      }

      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      
      // Handle different JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json(responses.unauthorized('Token abgelaufen'));
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json(responses.unauthorized('Ungültiges Token'));
      } else if (jwtError.name === 'NotBeforeError') {
        return res.status(401).json(responses.unauthorized('Token noch nicht gültig'));
      } else {
        return res.status(401).json(responses.unauthorized('Token-Verifikation fehlgeschlagen'));
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
};

// Optional middleware for endpoints that work with or without auth
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without authentication
    req.user = null;
    return next();
  }

  // Token provided, try to verify it
  const token = authHeader.substring(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    req.user = {
      role: decoded.role,
      timestamp: decoded.timestamp,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (jwtError) {
    // Invalid token, continue without authentication
    req.user = null;
  }

  next();
};

// Middleware to check if user is admin (used after optionalAuthMiddleware)
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json(responses.forbidden('Admin-Berechtigung erforderlich'));
  }
  next();
};

// Rate limiting middleware specifically for admin routes
const adminRateLimit = (req, res, next) => {
  // This could be enhanced with Redis for distributed rate limiting
  // For now, we rely on the main rate limiting middleware
  
  // Log admin actions for security monitoring
  if (req.user && req.user.role === 'admin') {
    console.log(`[ADMIN ACTION] ${req.method} ${req.originalUrl} by admin at ${new Date().toISOString()}`);
  }
  
  next();
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuthMiddleware;
module.exports.requireAdmin = requireAdmin;
module.exports.adminRateLimit = adminRateLimit;
