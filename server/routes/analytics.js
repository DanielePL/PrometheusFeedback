const express = require('express');
const { query, validationResult } = require('express-validator');
const router = express.Router();

const supabaseService = require('../services/supabaseService');
const { responses, utils } = require('../utils/helpers');

// Get analytics summary
router.get('/summary', utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_analytics_summary' });

  try {
    // Update analytics before returning
    await supabaseService.updateAnalyticsSummary();
    
    const analyticsResult = await supabaseService.getAnalyticsSummary();
    
    if (!analyticsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Analytics', 'ANALYTICS_LOAD_FAILED'));
    }

    res.json(responses.success(analyticsResult.data, 'Analytics erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get detailed analytics by category
router.get('/by-category', [
  query('category').optional().isIn(['features', 'performance', 'bugs', 'general', 'ai_coaching', 'community']).withMessage('Ungültige Kategorie'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'get_analytics_by_category' });

  const { category } = req.query;

  try {
    // Get all responses
    const responsesResult = await supabaseService.getAllResponses();
    
    if (!responsesResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Antworten', 'RESPONSES_LOAD_FAILED'));
    }

    const responses = responsesResult.data;

    // Filter by category if specified
    const filteredResponses = category 
      ? responses.filter(r => r.questions?.category === category)
      : responses;

    // Group by category
    const categorizedData = filteredResponses.reduce((acc, response) => {
      const cat = response.questions?.category || 'general';
      
      if (!acc[cat]) {
        acc[cat] = {
          category: cat,
          responses: [],
          avgRating: 0,
          totalResponses: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      acc[cat].responses.push(response);
      acc[cat].totalResponses++;

      if (response.rating_value) {
        acc[cat].ratingDistribution[response.rating_value]++;
      }

      return acc;
    }, {});

    // Calculate averages
    Object.values(categorizedData).forEach(category => {
      const ratings = category.responses
        .filter(r => r.rating_value)
        .map(r => r.rating_value);
      
      if (ratings.length > 0) {
        category.avgRating = Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 100) / 100;
      }
    });

    res.json(responses.success(categorizedData, 'Kategorie-Analytics erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting analytics by category:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get analytics trends over time
router.get('/trends', [
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Tage müssen zwischen 1 und 365 liegen'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'get_analytics_trends' });

  const days = parseInt(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Get sessions from the specified period
    const sessionsResult = await supabaseService.getAllSessions(1000, 0);
    
    if (!sessionsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Sessions', 'SESSIONS_LOAD_FAILED'));
    }

    const sessions = sessionsResult.data.filter(session => 
      new Date(session.created_at) >= startDate
    );

    // Get responses from these sessions
    const responsesResult = await supabaseService.getAllResponses();
    
    if (!responsesResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Antworten', 'RESPONSES_LOAD_FAILED'));
    }

    const sessionIds = new Set(sessions.map(s => s.id));
    const responses = responsesResult.data.filter(r => 
      sessionIds.has(r.session_id)
    );

    // Group by date
    const trendData = {};
    
    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      trendData[dateStr] = {
        date: dateStr,
        sessions: 0,
        completedSessions: 0,
        responses: 0,
        avgRating: 0,
        ratings: []
      };
    }

    // Fill with actual data
    sessions.forEach(session => {
      const dateStr = session.created_at.split('T')[0];
      if (trendData[dateStr]) {
        trendData[dateStr].sessions++;
        if (session.status === 'completed') {
          trendData[dateStr].completedSessions++;
        }
      }
    });

    responses.forEach(response => {
      const dateStr = response.created_at.split('T')[0];
      if (trendData[dateStr]) {
        trendData[dateStr].responses++;
        if (response.rating_value) {
          trendData[dateStr].ratings.push(response.rating_value);
        }
      }
    });

    // Calculate averages
    Object.values(trendData).forEach(day => {
      if (day.ratings.length > 0) {
        day.avgRating = Math.round((day.ratings.reduce((sum, rating) => sum + rating, 0) / day.ratings.length) * 100) / 100;
      }
      delete day.ratings; // Remove raw ratings from response
    });

    const sortedTrends = Object.values(trendData).sort((a, b) => a.date.localeCompare(b.date));

    res.json(responses.success({
      period: days,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
      trends: sortedTrends
    }, 'Trend-Analytics erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting analytics trends:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get top and worst performing questions
router.get('/performance', utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_question_performance' });

  try {
    const analyticsResult = await supabaseService.getAnalyticsSummary();
    
    if (!analyticsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Analytics', 'ANALYTICS_LOAD_FAILED'));
    }

    const analytics = analyticsResult.data;

    // Filter out questions without ratings
    const ratedQuestions = analytics.filter(item => item.avg_rating > 0);

    // Sort by rating
    const topPerforming = ratedQuestions
      .sort((a, b) => b.avg_rating - a.avg_rating)
      .slice(0, 10);

    const worstPerforming = ratedQuestions
      .sort((a, b) => a.avg_rating - b.avg_rating)
      .slice(0, 10);

    // Most responded questions
    const mostResponded = analytics
      .sort((a, b) => b.total_responses - a.total_responses)
      .slice(0, 10);

    // Questions with highest positive sentiment
    const highestPositive = analytics
      .filter(item => item.total_responses > 0)
      .sort((a, b) => (b.positive_count / b.total_responses) - (a.positive_count / a.total_responses))
      .slice(0, 10);

    res.json(responses.success({
      topPerforming,
      worstPerforming,
      mostResponded,
      highestPositive,
      totalQuestions: analytics.length,
      ratedQuestions: ratedQuestions.length
    }, 'Performance-Analytics erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting performance analytics:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get completion rate analytics
router.get('/completion', utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_completion_analytics' });

  try {
    const sessionsResult = await supabaseService.getAllSessions(1000, 0);
    
    if (!sessionsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Sessions', 'SESSIONS_LOAD_FAILED'));
    }

    const sessions = sessionsResult.data;
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const pendingSessions = totalSessions - completedSessions;

    // Calculate completion times for completed sessions
    const completionTimes = sessions
      .filter(s => s.status === 'completed' && s.completed_at && s.created_at)
      .map(s => {
        const start = new Date(s.created_at);
        const end = new Date(s.completed_at);
        return Math.round((end - start) / 1000 / 60); // minutes
      });

    const avgCompletionTime = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length)
      : 0;

    // Group by completion date
    const completionsByDate = {};
    sessions
      .filter(s => s.status === 'completed')
      .forEach(session => {
        const date = session.completed_at?.split('T')[0];
        if (date) {
          completionsByDate[date] = (completionsByDate[date] || 0) + 1;
        }
      });

    res.json(responses.success({
      totalSessions,
      completedSessions,
      pendingSessions,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      avgCompletionTime,
      completionsByDate,
      completionTimeDistribution: {
        fast: completionTimes.filter(t => t <= 5).length, // <= 5 minutes
        medium: completionTimes.filter(t => t > 5 && t <= 15).length, // 5-15 minutes
        slow: completionTimes.filter(t => t > 15).length // > 15 minutes
      }
    }, 'Completion-Analytics erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting completion analytics:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Update analytics (manual trigger)
router.post('/update', utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'update_analytics' });

  try {
    const updateResult = await supabaseService.updateAnalyticsSummary();
    
    if (!updateResult.success) {
      return res.status(500).json(responses.error('Fehler beim Aktualisieren der Analytics', 'ANALYTICS_UPDATE_FAILED'));
    }

    res.json(responses.success(updateResult.data, 'Analytics erfolgreich aktualisiert'));
  } catch (error) {
    console.error('Error updating analytics:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

module.exports = router;
