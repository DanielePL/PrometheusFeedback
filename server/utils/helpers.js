const CONSTANTS = require('./constants');

// Validation helpers
const validators = {
  // Email validation
  isValidEmail(email) {
    return CONSTANTS.VALIDATION.EMAIL_REGEX.test(email);
  },

  // Password validation
  isValidPassword(password) {
    return password && password.length >= CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH;
  },

  // Text length validation
  isValidTextLength(text, maxLength = CONSTANTS.VALIDATION.TEXT_MAX_LENGTH) {
    return text && text.length <= maxLength;
  },

  // Rating validation
  isValidRating(rating) {
    const num = Number(rating);
    return num >= CONSTANTS.RATING_SCALE.MIN && num <= CONSTANTS.RATING_SCALE.MAX;
  },

  // Question type validation
  isValidQuestionType(type) {
    return Object.values(CONSTANTS.QUESTION_TYPES).includes(type);
  },

  // Category validation
  isValidCategory(category) {
    return Object.values(CONSTANTS.CATEGORIES).includes(category);
  },

  // UUID validation
  isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
};

// Response helpers
const responses = {
  // Success response
  success(data = null, message = 'Erfolgreich') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Error response
  error(message = 'Ein Fehler ist aufgetreten', code = 'GENERAL_ERROR', details = null) {
    const response = {
      success: false,
      message,
      error: {
        code,
        timestamp: new Date().toISOString()
      }
    };

    if (details && process.env.NODE_ENV === 'development') {
      response.error.details = details;
    }

    return response;
  },

  // Validation error response
  validationError(errors) {
    return {
      success: false,
      message: 'Validierungsfehler',
      error: {
        code: 'VALIDATION_ERROR',
        errors,
        timestamp: new Date().toISOString()
      }
    };
  },

  // Not found response
  notFound(resource = 'Ressource') {
    return {
      success: false,
      message: `${resource} nicht gefunden`,
      error: {
        code: 'NOT_FOUND',
        timestamp: new Date().toISOString()
      }
    };
  },

  // Unauthorized response
  unauthorized(message = 'Nicht autorisiert') {
    return {
      success: false,
      message,
      error: {
        code: 'UNAUTHORIZED',
        timestamp: new Date().toISOString()
      }
    };
  },

  // Forbidden response
  forbidden(message = 'Zugriff verweigert') {
    return {
      success: false,
      message,
      error: {
        code: 'FORBIDDEN',
        timestamp: new Date().toISOString()
      }
    };
  }
};

// Utility functions
const utils = {
  // Generate session token
  generateSessionToken() {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  },

  // Clean and sanitize text input
  sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .substring(0, CONSTANTS.VALIDATION.TEXT_MAX_LENGTH);
  },

  // Format date for display
  formatDate(date) {
    return new Date(date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Calculate average rating
  calculateAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    
    const validRatings = ratings.filter(r => r && !isNaN(r));
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, rating) => acc + Number(rating), 0);
    return Math.round((sum / validRatings.length) * 100) / 100;
  },

  // Group data by field
  groupBy(array, field) {
    return array.reduce((groups, item) => {
      const key = item[field];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  },

  // Remove sensitive data for export
  sanitizeForExport(data) {
    return data.map(item => {
      const sanitized = { ...item };
      
      // Remove sensitive fields
      delete sanitized.user_email;
      delete sanitized.session_token;
      delete sanitized.ip_address;
      
      return sanitized;
    });
  },

  // Convert to CSV
  convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          
          // Escape quotes and wrap in quotes if necessary
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  },

  // Async wrapper for error handling
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  },

  // Rate limiting key generator
  generateRateLimitKey(req) {
    // Use IP + User Agent for more specific rate limiting
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    return `${ip}:${userAgent.substring(0, 50)}`;
  },

  // Log request for debugging
  logRequest(req, additionalInfo = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.method !== 'GET' ? req.body : undefined,
        ...additionalInfo
      });
    }
  },

  // Validate request body structure
  validateRequestBody(body, requiredFields = []) {
    const errors = [];
    
    if (!body || typeof body !== 'object') {
      errors.push('Request body ist erforderlich');
      return errors;
    }
    
    requiredFields.forEach(field => {
      if (!(field in body) || body[field] === null || body[field] === undefined || body[field] === '') {
        errors.push(`Feld '${field}' ist erforderlich`);
      }
    });
    
    return errors;
  }
};

// Error classes
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'GENERAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Ressource') {
    super(`${resource} nicht gefunden`, 404, 'NOT_FOUND');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Nicht autorisiert') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Zugriff verweigert') {
    super(message, 403, 'FORBIDDEN');
  }
}

module.exports = {
  validators,
  responses,
  utils,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError
};
