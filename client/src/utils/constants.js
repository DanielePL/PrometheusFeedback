// App-weite Konstanten
export const CONSTANTS = {
  // UI-Konstanten
  BRAND_NAME: 'Prometheus',
  APP_NAME: 'Prometheus Feedback',
  
  // Farben (für JS-Nutzung)
  COLORS: {
    PROMETHEUS_ORANGE: '#ff6600',
    PROMETHEUS_DARK: '#1a1a1a',
    PROMETHEUS_GRAY: '#2d2d2d',
    PROMETHEUS_GRAY_LIGHT: '#404040',
    PROMETHEUS_GRAY_LIGHTER: '#666666'
  },

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

  // Rating Values
  RATING_SCALE: {
    MIN: 1,
    MAX: 5,
    LABELS: {
      1: 'Sehr schlecht',
      2: 'Schlecht',
      3: 'Okay',
      4: 'Gut',
      5: 'Sehr gut'
    }
  },

  // Session Status
  SESSION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed'
  },

  // API Endpoints
  API_ENDPOINTS: {
    FEEDBACK_START: '/feedback/start',
    FEEDBACK_SUBMIT: '/feedback/submit',
    FEEDBACK_QUESTIONS: '/feedback/questions',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_ANALYTICS: '/admin/analytics',
    ADMIN_SESSIONS: '/admin/sessions',
    ADMIN_QUESTIONS: '/admin/questions',
    ADMIN_EXPORT: '/admin/export'
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    ADMIN_TOKEN: 'admin_token',
    FEEDBACK_SESSION: 'feedback_session',
    FEEDBACK_PROGRESS: 'feedback_progress'
  },

  // Timeouts und Delays
  TIMEOUTS: {
    API_TIMEOUT: 10000,
    TOAST_DURATION: 3000,
    AUTO_SAVE_DELAY: 2000
  },

  // Mobile Breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280
  },

  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    TEXT_MAX_LENGTH: 1000
  },

  // Default Questions (wird auch vom Backend verwendet)
  DEFAULT_QUESTIONS: [
    {
      question_text: 'Wie bewerten Sie die Velocity-Based Training (VBT) Funktionen?',
      question_type: 'rating',
      category: 'features',
      order_index: 1
    },
    {
      question_text: 'Sind die Range of Motion (ROM) Analysen hilfreich?',
      question_type: 'rating',
      category: 'features',
      order_index: 2
    },
    {
      question_text: 'Haben Sie Probleme mit der Bar Path Tracking?',
      question_type: 'text',
      category: 'bugs',
      order_index: 3
    },
    {
      question_text: 'Wie intelligent finden Sie die AI-Trainingsanpassungen?',
      question_type: 'rating',
      category: 'ai_coaching',
      order_index: 4
    },
    {
      question_text: 'Sind die personalisierten Empfehlungen relevant?',
      question_type: 'rating',
      category: 'ai_coaching',
      order_index: 5
    },
    {
      question_text: 'Wie bewerten Sie das Community-Erlebnis?',
      question_type: 'rating',
      category: 'community',
      order_index: 6
    },
    {
      question_text: 'Sind die Masterclasses wertvoll?',
      question_type: 'rating',
      category: 'community',
      order_index: 7
    },
    {
      question_text: 'Welche Features fehlen Ihnen am meisten?',
      question_type: 'text',
      category: 'general',
      order_index: 8
    },
    {
      question_text: 'Haben Sie Bugs oder technische Probleme entdeckt?',
      question_type: 'text',
      category: 'bugs',
      order_index: 9
    },
    {
      question_text: 'Wie wahrscheinlich würden Sie Prometheus weiterempfehlen?',
      question_type: 'rating',
      category: 'general',
      order_index: 10
    }
  ],

  // UI Messages
  MESSAGES: {
    FEEDBACK_THANK_YOU: 'Vielen Dank für Ihr Feedback!',
    FEEDBACK_REWARD: 'Als Dankeschön erhalten Sie 3 Monate kostenlosen Zugang zu unserem Premium-Bereich.',
    LOGIN_SUCCESS: 'Erfolgreich eingeloggt',
    LOGIN_ERROR: 'Login fehlgeschlagen',
    SAVE_SUCCESS: 'Erfolgreich gespeichert',
    SAVE_ERROR: 'Fehler beim Speichern',
    DELETE_CONFIRM: 'Sind Sie sicher, dass Sie dies löschen möchten?',
    EXPORT_SUCCESS: 'Export erfolgreich',
    NETWORK_ERROR: 'Netzwerkfehler. Bitte versuchen Sie es erneut.'
  }
};
