const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

const supabaseService = require('../services/supabaseService');
const { responses, utils, validators, ValidationError } = require('../utils/helpers');

// Start a new feedback session
router.post('/start', [
  body('userEmail').optional().isEmail().withMessage('Ungültige E-Mail-Adresse'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'start_feedback_session' });

  const { userEmail } = req.body;
  
  try {
    // Validate email if provided
    if (userEmail && !validators.isValidEmail(userEmail)) {
      return res.status(400).json(responses.error('Ungültige E-Mail-Adresse', 'INVALID_EMAIL'));
    }

    // Create new feedback session
    const sessionResult = await supabaseService.createFeedbackSession(userEmail);
    
    if (!sessionResult.success) {
      return res.status(500).json(responses.error('Fehler beim Erstellen der Session', 'SESSION_CREATION_FAILED'));
    }

    res.json(responses.success(sessionResult.data, 'Feedback-Session erfolgreich gestartet'));
  } catch (error) {
    console.error('Error starting feedback session:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get active questions
router.get('/questions', utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_questions' });

  try {
    const questionsResult = await supabaseService.getActiveQuestions();
    
    if (!questionsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Laden der Fragen', 'QUESTIONS_LOAD_FAILED'));
    }

    // If no questions exist, initialize default questions
    if (!questionsResult.data || questionsResult.data.length === 0) {
      const initResult = await supabaseService.initializeDefaultQuestions();
      if (initResult.success) {
        const newQuestionsResult = await supabaseService.getActiveQuestions();
        return res.json(responses.success(newQuestionsResult.data, 'Standard-Fragen initialisiert'));
      }
    }

    res.json(responses.success(questionsResult.data, 'Fragen erfolgreich geladen'));
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Submit feedback responses
router.post('/submit', [
  body('sessionId').isUUID().withMessage('Ungültige Session-ID'),
  body('responses').isObject().withMessage('Antworten müssen ein Objekt sein'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  utils.logRequest(req, { action: 'submit_feedback' });

  const { sessionId, responses: feedbackResponses } = req.body;

  try {
    // Validate session exists
    const sessionResult = await supabaseService.getFeedbackSession(sessionId);
    if (!sessionResult.success) {
      return res.status(404).json(responses.notFound('Feedback-Session'));
    }

    const session = sessionResult.data;
    if (session.status === 'completed') {
      return res.status(400).json(responses.error('Session bereits abgeschlossen', 'SESSION_ALREADY_COMPLETED'));
    }

    // Validate responses
    const responseValidationErrors = [];
    const responseEntries = Object.entries(feedbackResponses);

    if (responseEntries.length === 0) {
      return res.status(400).json(responses.error('Mindestens eine Antwort ist erforderlich', 'NO_RESPONSES'));
    }

    // Get all questions to validate against
    const questionsResult = await supabaseService.getAllQuestions();
    if (!questionsResult.success) {
      return res.status(500).json(responses.error('Fehler beim Validieren der Antworten', 'VALIDATION_ERROR'));
    }

    const questionsMap = questionsResult.data.reduce((map, q) => {
      map[q.id] = q;
      return map;
    }, {});

    // Save each response
    const savedResponses = [];
    for (const [questionId, responseData] of responseEntries) {
      // Validate question exists
      const question = questionsMap[questionId];
      if (!question) {
        responseValidationErrors.push(`Frage ${questionId} nicht gefunden`);
        continue;
      }

      // Validate response format
      if (!responseData || typeof responseData !== 'object') {
        responseValidationErrors.push(`Ungültige Antwort für Frage ${questionId}`);
        continue;
      }

      const { responseValue, ratingValue } = responseData;

      // Validate based on question type
      if (question.question_type === 'rating') {
        if (!validators.isValidRating(ratingValue)) {
          responseValidationErrors.push(`Ungültige Bewertung für Frage ${questionId} (1-5 erwartet)`);
          continue;
        }
      } else if (question.question_type === 'text') {
        if (!responseValue || !validators.isValidTextLength(responseValue)) {
          responseValidationErrors.push(`Ungültige Textantwort für Frage ${questionId}`);
          continue;
        }
      }

      // Sanitize text input
      const cleanResponseValue = utils.sanitizeText(responseValue);

      // Save response
      const saveResult = await supabaseService.saveResponse(
        sessionId,
        questionId,
        cleanResponseValue,
        ratingValue
      );

      if (saveResult.success) {
        savedResponses.push(saveResult.data);
      } else {
        responseValidationErrors.push(`Fehler beim Speichern der Antwort für Frage ${questionId}`);
      }
    }

    // If there were validation errors, return them
    if (responseValidationErrors.length > 0) {
      return res.status(400).json(responses.validationError(responseValidationErrors));
    }

    // Complete the session
    const completeResult = await supabaseService.completeFeedbackSession(sessionId);
    if (!completeResult.success) {
      console.error('Error completing session:', completeResult.error);
      // Don't fail the entire request if we can't mark as completed
    }

    // Update analytics (async, don't wait for completion)
    supabaseService.updateAnalyticsSummary().catch(error => {
      console.error('Error updating analytics:', error);
    });

    res.json(responses.success({
      session: completeResult.data || session,
      responses: savedResponses,
      responsesCount: savedResponses.length
    }, 'Feedback erfolgreich eingereicht'));

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Get feedback session details (for debugging/admin)
router.get('/session/:sessionId', [
  param('sessionId').isUUID().withMessage('Ungültige Session-ID'),
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  const { sessionId } = req.params;
  
  try {
    const sessionResult = await supabaseService.getFeedbackSession(sessionId);
    
    if (!sessionResult.success) {
      return res.status(404).json(responses.notFound('Feedback-Session'));
    }

    // Get responses for this session
    const responsesResult = await supabaseService.getResponsesBySession(sessionId);
    
    const sessionData = {
      session: sessionResult.data,
      responses: responsesResult.success ? responsesResult.data : []
    };

    res.json(responses.success(sessionData, 'Session-Details geladen'));
  } catch (error) {
    console.error('Error getting session details:', error);
    res.status(500).json(responses.error('Interner Serverfehler', 'INTERNAL_ERROR'));
  }
}));

// Health check for feedback system
router.get('/health', utils.asyncHandler(async (req, res) => {
  try {
    // Test database connection
    const dbTest = await supabaseService.testConnection();
    
    // Get basic stats
    const questionsResult = await supabaseService.getActiveQuestions();
    const questionsCount = questionsResult.success ? questionsResult.data.length : 0;

    res.json(responses.success({
      database: dbTest.success ? 'healthy' : 'error',
      activeQuestions: questionsCount,
      timestamp: new Date().toISOString()
    }, 'Feedback-System Status'));
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json(responses.error('Health Check fehlgeschlagen', 'HEALTH_CHECK_FAILED'));
  }
}));

module.exports = router;
