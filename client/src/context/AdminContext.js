import React, { createContext, useContext, useState, useEffect } from 'react';
import { feedbackService } from '../services/feedbackService';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin muss innerhalb eines AdminProvider verwendet werden');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Initial Load - Admin Status prüfen
  useEffect(() => {
    const checkAdminStatus = () => {
      const loggedIn = feedbackService.isAdminLoggedIn();
      setIsLoggedIn(loggedIn);
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  // Admin Login
  const login = async (password) => {
    try {
      setLoading(true);
      await feedbackService.adminLogin(password);
      setIsLoggedIn(true);
      await loadDashboardData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin Logout
  const logout = () => {
    feedbackService.adminLogout();
    setIsLoggedIn(false);
    setAnalyticsData(null);
    setSessions([]);
    setQuestions([]);
  };

  // Dashboard Daten laden
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [analyticsResult, sessionsResult] = await Promise.all([
        feedbackService.getAdminAnalytics(),
        feedbackService.getAllSessions()
      ]);

      setAnalyticsData(analyticsResult);
      setSessions(sessionsResult.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  // Questions Management
  const createQuestion = async (questionData) => {
    try {
      const result = await feedbackService.createQuestion(questionData);
      setQuestions(prev => [...prev, result.data]);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateQuestion = async (questionId, questionData) => {
    try {
      const result = await feedbackService.updateQuestion(questionId, questionData);
      setQuestions(prev => 
        prev.map(q => q.id === questionId ? result.data : q)
      );
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await feedbackService.deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleQuestion = async (questionId) => {
    try {
      const result = await feedbackService.toggleQuestion(questionId);
      setQuestions(prev => 
        prev.map(q => q.id === questionId ? result.data : q)
      );
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Export Funktionalität
  const exportData = async (format = 'json') => {
    try {
      await feedbackService.exportResponses(format);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Dashboard Stats berechnen
  const getDashboardStats = () => {
    if (!analyticsData || !sessions) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        avgRating: 0,
        totalResponses: 0,
        completionRate: 0
      };
    }

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions * 100) : 0;
    
    const totalResponses = analyticsData.reduce((sum, item) => sum + (item.total_responses || 0), 0);
    const avgRating = analyticsData.length > 0 
      ? analyticsData.reduce((sum, item) => sum + (item.avg_rating || 0), 0) / analyticsData.length 
      : 0;

    return {
      totalSessions,
      completedSessions,
      avgRating: Math.round(avgRating * 100) / 100,
      totalResponses,
      completionRate: Math.round(completionRate)
    };
  };

  const value = {
    isLoggedIn,
    loading,
    analyticsData,
    sessions,
    questions,
    login,
    logout,
    loadDashboardData,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    toggleQuestion,
    exportData,
    getDashboardStats
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
