import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Axios Instance mit Standard-Konfiguration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor für Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor für Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const feedbackService = {
  // Neue Feedback-Session starten
  async startSession(userEmail = null) {
    try {
      const response = await api.post('/feedback/start', { userEmail });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Starten der Session');
    }
  },

  // Aktive Fragen laden
  async getQuestions() {
    try {
      const response = await api.get('/feedback/questions');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Laden der Fragen');
    }
  },

  // Feedback einreichen
  async submitFeedback(sessionId, responses) {
    try {
      const response = await api.post('/feedback/submit', {
        sessionId,
        responses
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Einreichen des Feedbacks');
    }
  },

  // Admin Login
  async adminLogin(password) {
    try {
      const response = await api.post('/admin/login', { password });
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login fehlgeschlagen');
    }
  },

  // Admin Logout
  adminLogout() {
    localStorage.removeItem('admin_token');
  },

  // Admin Status prüfen
  isAdminLoggedIn() {
    return !!localStorage.getItem('admin_token');
  },

  // Dashboard Analytics laden
  async getAdminAnalytics() {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Laden der Analytics');
    }
  },

  // Alle Feedback-Sessions laden
  async getAllSessions() {
    try {
      const response = await api.get('/admin/sessions');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Laden der Sessions');
    }
  },

  // Question Management
  async createQuestion(questionData) {
    try {
      const response = await api.post('/admin/questions', questionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Erstellen der Frage');
    }
  },

  async updateQuestion(questionId, questionData) {
    try {
      const response = await api.put(`/admin/questions/${questionId}`, questionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Aktualisieren der Frage');
    }
  },

  async deleteQuestion(questionId) {
    try {
      const response = await api.delete(`/admin/questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Löschen der Frage');
    }
  },

  async toggleQuestion(questionId) {
    try {
      const response = await api.patch(`/admin/questions/${questionId}/toggle`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Umschalten der Frage');
    }
  },

  // Export Funktionalitäten
  async exportResponses(format = 'json') {
    try {
      const response = await api.get(`/admin/export?format=${format}`, {
        responseType: 'blob'
      });
      
      // Download-Link erstellen
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prometheus-feedback-export-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Exportieren');
    }
  }
};

export default feedbackService;
