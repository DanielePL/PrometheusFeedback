const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();

const supabaseService = require('../services/supabaseService');
const authMiddleware = require('../middleware/auth');
const { responses, utils, validators, UnauthorizedError } = require('../utils/helpers');

// Admin login
router.post('/login', [
  body('password').notEmpty().withMessage('Passwort ist erforderlich'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'admin_login' });

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not set in environment variables');
    return res.status(500).json(responses.error('Server-Konfigurationsfehler', 'CONFIG_ERROR'));
  }

  try {
    // Simple password comparison (in production, use hashed passwords)
    const isValidPassword = password === adminPassword;
    
    if (!isValidPassword) {
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json(responses.unauthorized('Ungültiges Passwort'));
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        role: 'admin',
        timestamp: Date.now()
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    );

    res.json(responses.success({
      token,
      expiresIn: '24h'
    }, 'Erfolgreich angemeldet'));

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Verify admin token (middleware test endpoint)
router.get('/verify', authMiddleware, utils.asyncHandler(async (req, res) => {
  res.json(responses.success({
    authenticated: true,
    user: req.user
  }, 'Token gültig'));
}));

// Get analytics data
router.get('/analytics', authMiddleware, utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_analytics' });

  try {
    // Update analytics before returning
    await supabaseService.updateAnalyticsSummary();
    
    const analyticsResult = await supabaseService.getAnalyticsSummary();
    
    if (!analyticsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Analytics', 'ANALYTICS_LOAD_FAILED'));
    }

    res.json(responses.success(analyticsResult.data, 'Analytics erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get all feedback sessions
router.get('/sessions', authMiddleware, [
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit muss zwischen 1 und 1000 liegen'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset muss >= 0 sein'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'get_sessions' });

  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const sessionsResult = await supabaseService.getAllSessions(limit, offset);
    
    if (!sessionsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Sessions', 'SESSIONS_LOAD_FAILED'));
    }

    res.json(responses.success({
      sessions: sessionsResult.data,
      pagination: {
        limit,
        offset,
        total: sessionsResult.count
      }
    }, 'Sessions erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get all responses
router.get('/responses', authMiddleware, utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_responses' });

  try {
    const responsesResult = await supabaseService.getAllResponses();
    
    if (!responsesResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Antworten', 'RESPONSES_LOAD_FAILED'));
    }

    res.json(responses.success(responsesResult.data, 'Antworten erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting responses:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Export data
router.get('/export', authMiddleware, [
  query('format').optional().isIn(['json', 'csv']).withMessage('Format muss json oder csv sein'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'export_data' });

  const format = req.query.format || 'json';

  try {
    // Get all responses with related data
    const responsesResult = await supabaseService.getAllResponses();
    
    if (!responsesResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Daten', 'DATA_LOAD_FAILED'));
    }

    // Sanitize data for export (remove sensitive information)
    const sanitizedData = utils.sanitizeForExport(responsesResult.data);

    if (format === 'csv') {
      const csvData = utils.convertToCSV(sanitizedData);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="prometheus-feedback-export-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="prometheus-feedback-export-${new Date().toISOString().split('T')[0]}.json"`);
      res.json({
        exportDate: new Date().toISOString(),
        totalRecords: sanitizedData.length,
        data: sanitizedData
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Question Management
router.get('/questions', authMiddleware, utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_all_questions' });

  try {
    const questionsResult = await supabaseService.getAllQuestions();
    
    if (!questionsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Fragen', 'QUESTIONS_LOAD_FAILED'));
    }

    res.json(responses.success(questionsResult.data, 'Fragen erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

router.post('/questions', authMiddleware, [
  body('question_text').notEmpty().trim().withMessage('Frage-Text ist erforderlich'),
  body('question_type').isIn(['rating', 'text', 'multiple_choice']).withMessage('Ungültiger Frage-Typ'),
  body('category').isIn(['features', 'performance', 'bugs', 'general', 'ai_coaching', 'community']).withMessage('Ungültige Kategorie'),
  body('order_index').isInt({ min: 1 }).withMessage('Reihenfolge muss eine positive Zahl sein'),
  body('is_active').optional().isBoolean().withMessage('is_active muss ein Boolean sein'),
  body('options').optional().isArray().withMessage('Optionen müssen ein Array sein'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'create_question' });

  try {
    const questionData = {
      question_text: req.body.question_text.trim(),
      question_type: req.body.question_type,
      category: req.body.category,
      order_index: req.body.order_index,
      is_active: req.body.is_active !== undefined ? req.body.is_active : true,
      options: req.body.options || null
    };

    const createResult = await supabaseService.createQuestion(questionData);
    
    if (!createResult.success) {
      return res.status(500).json(responses.error('Fehler beim Erstellen der Frage', 'QUESTION_CREATE_FAILED'));
    }

    res.status(201).json(responses.success(createResult.data, 'Frage erfolgreich erstellt'));
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

router.put('/questions/:questionId', authMiddleware, [
  param('questionId').isUUID().withMessage('Ungültige Frage-ID'),
  body('question_text').optional().notEmpty().trim().withMessage('Frage-Text darf nicht leer sein'),
  body('question_type').optional().isIn(['rating', 'text', 'multiple_choice']).withMessage('Ungültiger Frage-Typ'),
  body('category').optional().isIn(['features', 'performance', 'bugs', 'general', 'ai_coaching', 'community']).withMessage('Ungültige Kategorie'),
  body('order_index').optional().isInt({ min: 1 }).withMessage('Reihenfolge muss eine positive Zahl sein'),
  body('is_active').optional().isBoolean().withMessage('is_active muss ein Boolean sein'),
  body('options').optional().isArray().withMessage('Optionen müssen ein Array sein'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'update_question' });

  const { questionId } = req.params;
  
  try {
    // Filter out undefined values
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    });

    if (updateData.question_text) {
      updateData.question_text = updateData.question_text.trim();
    }

    const updateResult = await supabaseService.updateQuestion(questionId, updateData);
    
    if (!updateResult.success) {
      return res.status(500).json(responses.error('Fehler beim Aktualisieren der Frage', 'QUESTION_UPDATE_FAILED'));
    }

    res.json(responses.success(updateResult.data, 'Frage erfolgreich aktualisiert'));
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

router.delete('/questions/:questionId', authMiddleware, [
  param('questionId').isUUID().withMessage('Ungültige Frage-ID'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'delete_question' });

  const { questionId } = req.params;
  
  try {
    const deleteResult = await supabaseService.deleteQuestion(questionId);
    
    if (!deleteResult.success) {
      return res.status(500).json(responses.error('Fehler beim Löschen der Frage', 'QUESTION_DELETE_FAILED'));
    }

    res.json(responses.success(null, 'Frage erfolgreich gelöscht'));
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

router.patch('/questions/:questionId/toggle', authMiddleware, [
  param('questionId').isUUID().withMessage('Ungültige Frage-ID'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'toggle_question' });

  const { questionId } = req.params;
  
  try {
    const toggleResult = await supabaseService.toggleQuestionActive(questionId);
    
    if (!toggleResult.success) {
      return res.status(500).json(responses.error('Fehler beim Umschalten der Frage', 'QUESTION_TOGGLE_FAILED'));
    }

    res.json(responses.success(toggleResult.data, 'Frage-Status erfolgreich geändert'));
  } catch (error) {
    console.error('Error toggling question:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Dashboard statistics
router.get('/dashboard-stats', authMiddleware, utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_dashboard_stats' });

  try {
    // Get sessions data
    const sessionsResult = await supabaseService.getAllSessions(1000, 0);
    const sessions = sessionsResult.success ? sessionsResult.data : [];

    // Get analytics data
    await supabaseService.updateAnalyticsSummary();
    const analyticsResult = await supabaseService.getAnalyticsSummary();
    const analytics = analyticsResult.success ? analyticsResult.data : [];

    // Calculate statistics
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    
    const totalResponses = analytics.reduce((sum, item) => sum + (item.total_responses || 0), 0);
    const avgRating = analytics.length > 0 
      ? Math.round((analytics.reduce((sum, item) => sum + (item.avg_rating || 0), 0) / analytics.length) * 100) / 100
      : 0;

    const stats = {
      totalSessions,
      completedSessions,
      completionRate,
      totalResponses,
      avgRating,
      topRated: analytics
        .filter(item => item.avg_rating > 0)
        .sort((a, b) => b.avg_rating - a.avg_rating)
        .slice(0, 5),
      worstRated: analytics
        .filter(item => item.avg_rating > 0)
        .sort((a, b) => a.avg_rating - b.avg_rating)
        .slice(0, 5)
    };

    res.json(responses.success(stats, 'Dashboard-Statistiken geladen'));
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

module.exports = router;
