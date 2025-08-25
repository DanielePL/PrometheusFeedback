import { CONSTANTS } from './constants';

// Format-Helpers
export const formatters = {
  // Datum formatieren
  formatDate(date, includeTime = false) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    return new Intl.DateTimeFormat('de-DE', options).format(new Date(date));
  },

  // Relative Zeit (z.B. "vor 2 Stunden")
  formatRelativeTime(date) {
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = Math.floor((now - target) / 1000);

    if (diffInSeconds < 60) return 'gerade eben';
    if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Min.`;
    if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Std.`;
    if (diffInSeconds < 604800) return `vor ${Math.floor(diffInSeconds / 86400)} Tag(en)`;
    
    return this.formatDate(date);
  },

  // Prozent formatieren
  formatPercentage(value, decimals = 0) {
    return `${Number(value).toFixed(decimals)}%`;
  },

  // Rating formatieren (z.B. 4.2/5)
  formatRating(value, maxValue = 5) {
    return `${Number(value).toFixed(1)}/${maxValue}`;
  },

  // Kategorie Namen formatieren
  formatCategory(category) {
    const categoryNames = {
      features: 'Features',
      performance: 'Performance',
      bugs: 'Bugs & Probleme',
      general: 'Allgemein',
      ai_coaching: 'KI-Coaching',
      community: 'Community'
    };
    
    return categoryNames[category] || category;
  },

  // Question Type formatieren
  formatQuestionType(type) {
    const typeNames = {
      rating: 'Bewertung (1-5)',
      text: 'Freitext',
      multiple_choice: 'Multiple Choice'
    };
    
    return typeNames[type] || type;
  }
};

// Validation Helpers
export const validators = {
  // Email validieren
  isValidEmail(email) {
    return CONSTANTS.VALIDATION.EMAIL_REGEX.test(email);
  },

  // Passwort validieren
  isValidPassword(password) {
    return password && password.length >= CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH;
  },

  // Text Länge validieren
  isValidTextLength(text, maxLength = CONSTANTS.VALIDATION.TEXT_MAX_LENGTH) {
    return text && text.length <= maxLength;
  },

  // Rating validieren
  isValidRating(rating) {
    const num = Number(rating);
    return num >= CONSTANTS.RATING_SCALE.MIN && num <= CONSTANTS.RATING_SCALE.MAX;
  },

  // Required Field validieren
  isRequired(value) {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }
};

// Local Storage Helpers
export const storage = {
  // Item speichern
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern in localStorage:', error);
      return false;
    }
  },

  // Item laden
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Fehler beim Laden aus localStorage:', error);
      return defaultValue;
    }
  },

  // Item entfernen
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Fehler beim Entfernen aus localStorage:', error);
      return false;
    }
  },

  // Alle Items für App löschen
  clearAppData() {
    Object.values(CONSTANTS.STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }
};

// UI Helpers
export const ui = {
  // Scroll to Top
  scrollToTop(smooth = true) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  },

  // Viewport Größe prüfen
  isMobile() {
    return window.innerWidth < CONSTANTS.BREAKPOINTS.MOBILE;
  },

  isTablet() {
    return window.innerWidth >= CONSTANTS.BREAKPOINTS.MOBILE && 
           window.innerWidth < CONSTANTS.BREAKPOINTS.TABLET;
  },

  isDesktop() {
    return window.innerWidth >= CONSTANTS.BREAKPOINTS.DESKTOP;
  },

  // Touch Device erkennen
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Copy to Clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Fehler beim Kopieren:', error);
      return false;
    }
  },

  // Debounce Function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle Function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Analytics Helpers
export const analytics = {
  // Calculate average rating
  calculateAverageRating(responses) {
    const ratings = responses.filter(r => r.rating_value !== null);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, r) => acc + r.rating_value, 0);
    return sum / ratings.length;
  },

  // Calculate completion rate
  calculateCompletionRate(totalSessions, completedSessions) {
    if (totalSessions === 0) return 0;
    return (completedSessions / totalSessions) * 100;
  },

  // Group responses by category
  groupResponsesByCategory(responses) {
    return responses.reduce((acc, response) => {
      const category = response.question?.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(response);
      return acc;
    }, {});
  },

  // Get top rated items
  getTopRated(analytics, limit = 5) {
    return analytics
      .filter(item => item.avg_rating > 0)
      .sort((a, b) => b.avg_rating - a.avg_rating)
      .slice(0, limit);
  },

  // Get worst rated items
  getWorstRated(analytics, limit = 5) {
    return analytics
      .filter(item => item.avg_rating > 0)
      .sort((a, b) => a.avg_rating - b.avg_rating)
      .slice(0, limit);
  }
};

// Error Handling Helpers
export const errorHandler = {
  // API Error to User Message
  getErrorMessage(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return CONSTANTS.MESSAGES.NETWORK_ERROR;
  },

  // Log Error
  logError(error, context = '') {
    console.error(`[${context}] Error:`, error);
    
    // In Production: Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error tracking (Sentry, LogRocket, etc.)
    }
  }
};

// Data Processing Helpers
export const dataProcessing = {
  // Remove sensitive data from export
  sanitizeDataForExport(data) {
    return data.map(item => {
      const sanitized = { ...item };
      
      // Remove sensitive fields
      delete sanitized.user_email;
      delete sanitized.session_token;
      
      return sanitized;
    });
  },

  // Convert data to CSV format
  convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  },

  // Generate session token
  generateSessionToken() {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }
};
