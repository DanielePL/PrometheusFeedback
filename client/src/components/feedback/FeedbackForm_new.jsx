import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Send, 
  Loader,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';

const FeedbackForm = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Lade Fragen beim Komponenten-Mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Starte eine neue Feedback-Session
      const sessionResponse = await feedbackService.startFeedbackSession();
      setSessionId(sessionResponse.sessionId);
      
      // Lade aktive Fragen
      const questionsData = await feedbackService.getQuestions();
      setQuestions(questionsData.filter(q => q.is_active));
      
    } catch (err) {
      console.error('Fehler beim Laden der Fragen:', err);
      setError('Fragen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (questionId, value, responseType = 'rating') => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        value,
        type: responseType,
        questionId
      }
    }));
  };

  const handleSubmit = async () => {
    if (!sessionId || Object.keys(responses).length === 0) {
      setError('Bitte beantworten Sie mindestens eine Frage.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Konvertiere responses in das erwartete Format
      const responsesArray = Object.values(responses).map(response => ({
        questionId: response.questionId,
        value: response.value,
        responseType: response.type
      }));

      await feedbackService.submitFeedback(sessionId, responsesArray);
      setSubmitted(true);
      
    } catch (err) {
      console.error('Fehler beim Senden des Feedbacks:', err);
      setError('Feedback konnte nicht gesendet werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const currentQuestion = questions[currentQuestionIndex];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Lade Feedback-Fragen...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Fehler aufgetreten</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadQuestions}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // Success State
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vielen Dank!
          </h1>
          <p className="text-gray-600 mb-6">
            Ihr Feedback wurde erfolgreich übermittelt und hilft uns dabei, 
            Prometheus zu verbessern.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Neues Feedback geben
          </button>
        </div>
      </div>
    );
  }

  // No questions available
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Momentan sind keine Feedback-Fragen verfügbar.</p>
        </div>
      </div>
    );
  }

  const renderRatingQuestion = (question) => {
    const currentRating = responses[question.id]?.value || 0;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {question.question_text}
          </h2>
          {question.description && (
            <p className="text-gray-600 mb-6">{question.description}</p>
          )}
        </div>

        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleResponse(question.id, rating, 'rating')}
              className={`p-2 transition-all duration-200 ${
                rating <= currentRating
                  ? 'text-yellow-500'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <Star 
                className="w-12 h-12" 
                fill={rating <= currentRating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {currentRating > 0 ? `Bewertung: ${currentRating}/5` : 'Klicken Sie auf die Sterne zur Bewertung'}
          </p>
        </div>
      </div>
    );
  };

  const renderTextQuestion = (question) => {
    const currentValue = responses[question.id]?.value || '';
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {question.question_text}
          </h2>
          {question.description && (
            <p className="text-gray-600 mb-6">{question.description}</p>
          )}
        </div>

        <div>
          <textarea
            value={currentValue}
            onChange={(e) => handleResponse(question.id, e.target.value, 'text')}
            placeholder="Teilen Sie Ihre Gedanken mit..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    );
  };

  const renderQuestion = (question) => {
    switch (question.question_type) {
      case 'rating':
        return renderRatingQuestion(question);
      case 'text':
        return renderTextQuestion(question);
      default:
        return renderRatingQuestion(question);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Prometheus Beta Feedback
          </h1>
          <p className="text-gray-600">
            Frage {currentQuestionIndex + 1} von {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {renderQuestion(currentQuestion)}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={isFirstQuestion}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              isFirstQuestion
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück</span>
          </button>

          <div className="text-sm text-gray-500">
            {Object.keys(responses).length} von {questions.length} beantwortet
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(responses).length === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                isSubmitting || Object.keys(responses).length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Wird gesendet...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Feedback senden</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Weiter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
