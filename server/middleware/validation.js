const { body, param, query, validationResult } = require('express-validator');
const { responses, validators } = require('../utils/helpers');
const CONSTANTS = require('../utils/constants');

// Common validation rules
const validationRules = {
  // UUID validation
  uuid: (field = 'id') => param(field).isUUID().withMessage(`${field} muss eine gültige UUID sein`),
  
  // Email validation
  email: (field = 'email', required = false) => {
    const rule = required ? body(field).notEmpty() : body(field).optional();
    return rule.isEmail().withMessage('Ungültige E-Mail-Adresse');
  },

  // Password validation
  password: (field = 'password') => 
    body(field)
      .isLength({ min: CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH })
      .withMessage(`Passwort muss mindestens ${CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH} Zeichen lang sein`),

  // Text validation
  text: (field, maxLength = CONSTANTS.VALIDATION.TEXT_MAX_LENGTH, required = true) => {
    const rule = required ? body(field).notEmpty() : body(field).optional();
    return rule
      .trim()
      .isLength({ max: maxLength })
      .withMessage(`${field} darf maximal ${maxLength} Zeichen lang sein`);
  },

  // Rating validation
  rating: (field = 'rating') =>
    body(field)
      .isInt({ min: CONSTANTS.RATING_SCALE.MIN, max: CONSTANTS.RATING_SCALE.MAX })
      .withMessage(`Bewertung muss zwischen ${CONSTANTS.RATING_SCALE.MIN} und ${CONSTANTS.RATING_SCALE.MAX} liegen`),

  // Question type validation
  questionType: (field = 'question_type') =>
    body(field)
      .isIn(Object.values(CONSTANTS.QUESTION_TYPES))
      .withMessage('Ungültiger Frage-Typ'),

  // Category validation
  category: (field = 'category') =>
    body(field)
      .isIn(Object.values(CONSTANTS.CATEGORIES))
      .withMessage('Ungültige Kategorie'),

  // Pagination validation
  pagination: () => [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Limit muss zwischen 1 und 1000 liegen'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset muss >= 0 sein')
  ],

  // Order index validation
  orderIndex: (field = 'order_index') =>
    body(field)
      .isInt({ min: 1 })
      .withMessage('Reihenfolge muss eine positive Zahl sein'),

  // Boolean validation
  boolean: (field, required = false) => {
    const rule = required ? body(field).notEmpty() : body(field).optional();
    return rule.isBoolean().withMessage(`${field} muss ein Boolean-Wert sein`);
  },

  // Array validation
  array: (field, required = false) => {
    const rule = required ? body(field).notEmpty() : body(field).optional();
    return rule.isArray().withMessage(`${field} muss ein Array sein`);
  }
};

// Validation middleware factory
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }));

      return res.status(400).json(responses.validationError(formattedErrors));
    }

    next();
  };
};

// Specific validation sets for different endpoints
const validations = {
  // Feedback validations
  startFeedbackSession: validate([
    validationRules.email('userEmail', false)
  ]),

  submitFeedback: validate([
    validationRules.uuid('sessionId'),
    body('responses')
      .isObject()
      .withMessage('Antworten müssen ein Objekt sein')
      .custom((responses) => {
        if (Object.keys(responses).length === 0) {
          throw new Error('Mindestens eine Antwort ist erforderlich');
        }
        return true;
      })
  ]),

  getFeedbackSession: validate([
    validationRules.uuid('sessionId')
  ]),

  // Admin validations
  adminLogin: validate([
    body('password')
      .notEmpty()
      .withMessage('Passwort ist erforderlich')
  ]),

  getSessions: validate([
    ...validationRules.pagination()
  ]),

  exportData: validate([
    query('format')
      .optional()
      .isIn(['json', 'csv'])
      .withMessage('Format muss json oder csv sein')
  ]),

  // Question management validations
  createQuestion: validate([
    validationRules.text('question_text'),
    validationRules.questionType(),
    validationRules.category(),
    validationRules.orderIndex(),
    validationRules.boolean('is_active', false),
    validationRules.array('options', false)
  ]),

  updateQuestion: validate([
    validationRules.uuid('questionId'),
    validationRules.text('question_text', CONSTANTS.VALIDATION.TEXT_MAX_LENGTH, false),
    body('question_type')
      .optional()
      .isIn(Object.values(CONSTANTS.QUESTION_TYPES))
      .withMessage('Ungültiger Frage-Typ'),
    body('category')
      .optional()
      .isIn(Object.values(CONSTANTS.CATEGORIES))
      .withMessage('Ungültige Kategorie'),
    body('order_index')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Reihenfolge muss eine positive Zahl sein'),
    validationRules.boolean('is_active', false),
    validationRules.array('options', false)
  ]),

  deleteQuestion: validate([
    validationRules.uuid('questionId')
  ]),

  toggleQuestion: validate([
    validationRules.uuid('questionId')
  ])
};

// Custom validation functions
const customValidators = {
  // Validate response data structure
  validateResponseData: (responses, questions) => {
    const errors = [];
    const questionsMap = questions.reduce((map, q) => {
      map[q.id] = q;
      return map;
    }, {});

    Object.entries(responses).forEach(([questionId, responseData]) => {
      const question = questionsMap[questionId];
      
      if (!question) {
        errors.push(`Frage ${questionId} nicht gefunden`);
        return;
      }

      if (!responseData || typeof responseData !== 'object') {
        errors.push(`Ungültige Antwort für Frage ${questionId}`);
        return;
      }

      const { responseValue, ratingValue } = responseData;

      if (question.question_type === 'rating') {
        if (!validators.isValidRating(ratingValue)) {
          errors.push(`Ungültige Bewertung für Frage ${questionId} (1-5 erwartet)`);
        }
      } else if (question.question_type === 'text') {
        if (!responseValue || !validators.isValidTextLength(responseValue)) {
          errors.push(`Ungültige Textantwort für Frage ${questionId}`);
        }
      } else if (question.question_type === 'multiple_choice') {
        if (!responseValue || !question.options || !question.options.includes(responseValue)) {
          errors.push(`Ungültige Auswahl für Frage ${questionId}`);
        }
      }
    });

    return errors;
  },

  // Validate file upload
  validateFileUpload: (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
    const errors = [];

    if (!file) {
      errors.push('Datei ist erforderlich');
      return errors;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      errors.push(`Ungültiger Dateityp. Erlaubt: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      errors.push(`Datei zu groß. Maximum: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    return errors;
  },

  // Validate JSON structure
  validateJSONStructure: (data, requiredFields = []) => {
    const errors = [];

    if (!data || typeof data !== 'object') {
      errors.push('Ungültige JSON-Struktur');
      return errors;
    }

    requiredFields.forEach(field => {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        errors.push(`Feld '${field}' ist erforderlich`);
      }
    });

    return errors;
  }
};

// Sanitization middleware
const sanitize = {
  // Sanitize text input
  text: (fields = []) => (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field]
          .trim()
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .substring(0, CONSTANTS.VALIDATION.TEXT_MAX_LENGTH);
      }
    });
    next();
  },

  // Sanitize HTML input (basic)
  html: (fields = []) => (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/<[^>]*>/g, '') // Remove all HTML tags
          .trim();
      }
    });
    next();
  },

  // Sanitize email input
  email: (fields = []) => (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field].toLowerCase().trim();
      }
    });
    next();
  }
};

module.exports = {
  validationRules,
  validate,
  validations,
  customValidators,
  sanitize
};
