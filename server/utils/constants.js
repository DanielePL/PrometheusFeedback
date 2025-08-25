// Server-side constants
const CONSTANTS = {
  // Question Types
  QUESTION_TYPES: {
    RATING: 'rating',
    TEXT: 'text',
    MULTIPLE_CHOICE: 'multiple_choice'
  },

  // Categories
  CATEGORIES: {
    FEATURES: 'features',
    PERFORMANCE: 'performance',
    BUGS: 'bugs',
    GENERAL: 'general',
    AI_COACHING: 'ai_coaching',
    COMMUNITY: 'community'
  },

  // Session Status
  SESSION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed'
  },

  // Rating Scale
  RATING_SCALE: {
    MIN: 1,
    MAX: 5
  },

  // Validation
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    TEXT_MAX_LENGTH: 1000,
    PASSWORD_MIN_LENGTH: 8
  },

  // JWT
  JWT: {
    EXPIRES_IN: '24h',
    ALGORITHM: 'HS256'
  },

  // Default Questions
  DEFAULT_QUESTIONS: [
    {
      question_text: 'Wie bewerten Sie die Velocity-Based Training (VBT) Funktionen?',
      question_type: 'rating',
      category: 'features',
      order_index: 1,
      is_active: true
    },
    {
      question_text: 'Sind die Range of Motion (ROM) Analysen hilfreich?',
      question_type: 'rating',
      category: 'features',
      order_index: 2,
      is_active: true
    },
    {
      question_text: 'Haben Sie Probleme mit der Bar Path Tracking?',
      question_type: 'text',
      category: 'bugs',
      order_index: 3,
      is_active: true
    },
    {
      question_text: 'Wie intelligent finden Sie die AI-Trainingsanpassungen?',
      question_type: 'rating',
      category: 'ai_coaching',
      order_index: 4,
      is_active: true
    },
    {
      question_text: 'Sind die personalisierten Empfehlungen relevant?',
      question_type: 'rating',
      category: 'ai_coaching',
      order_index: 5,
      is_active: true
    },
    {
      question_text: 'Wie bewerten Sie das Community-Erlebnis?',
      question_type: 'rating',
      category: 'community',
      order_index: 6,
      is_active: true
    },
    {
      question_text: 'Sind die Masterclasses wertvoll?',
      question_type: 'rating',
      category: 'community',
      order_index: 7,
      is_active: true
    },
    {
      question_text: 'Welche Features fehlen Ihnen am meisten?',
      question_type: 'text',
      category: 'general',
      order_index: 8,
      is_active: true
    },
    {
      question_text: 'Haben Sie Bugs oder technische Probleme entdeckt?',
      question_type: 'text',
      category: 'bugs',
      order_index: 9,
      is_active: true
    },
    {
      question_text: 'Wie wahrscheinlich würden Sie Prometheus weiterempfehlen?',
      question_type: 'rating',
      category: 'general',
      order_index: 10,
      is_active: true
    }
  ]
};

module.exports = CONSTANTS;
