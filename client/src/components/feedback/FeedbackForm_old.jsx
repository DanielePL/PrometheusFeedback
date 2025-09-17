import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Send, 
  MessageCircle, 
  Smartphone, 
  Zap, 
  Target, 
  Brain, 
  Bug, 
  Clock,
  Battery,
  Camera,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
  Download,
  Loader
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
    
    // VBT Tracking
    vbt_sessionStarts: '',
    vbt_speedMeasurement: '',
    vbt_realtimeFeedback: '',
    vbt_repCounting: '',
    vbt_speedZones: '',
    vbt_sessionSaving: '',
    vbt_measurementAccuracy: '',
    vbt_consistency: '',
    
    // Bar Tracking
    barTracking_barPathDisplay: '',
    barTracking_romMeasurement: '',
    barTracking_movementAnalysis: '',
    barTracking_visualization: '',
    barTracking_cameraIntegration: '',
    barTracking_sessionStability: '',
    
    // AI Coach
    aiCoach_relevantRecommendations: '',
    aiCoach_workoutAdaptations: '',
    aiCoach_intensityRecommendations: '',
    aiCoach_messageClarity: '',
    aiCoach_interventionTiming: '',
    aiCoach_personalization: '',
    
    // UX & Performance
    ux_appDesign: '',
    ux_navigation: '',
    ux_startupSpeed: '',
    ux_crashes: '',
    ux_batteryLife: '',
    ux_transitions: '',
    
    // Mobile Specific
    mobile_touchGestures: '',
    mobile_notifications: '',
    mobile_cameraAccess: '',
    mobile_responsiveness: '',
    
    // Beta Specific
    beta_onboardingClear: '',
    beta_tutorialHelpful: '',
    beta_feedbackButton: '',
    beta_supportAccess: '',
    
    // Usage Scenarios
    scenario_kraftWorkout: '',
    scenario_technikAnalyse: '',
    scenario_aiTraining: '',
    scenario_exerciseDiscovery: '',
    
    // Edge Cases
    edge_poorInternet: '',
    edge_lowBattery: '',
    edge_appCrashRecovery: '',
    
    // Open Feedback
    worksWell: '',
    priorityImprovements: '',
    missingFeatures: '',
    additionalComments: '',
    
    // Bug Reports
    bugs: []
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentBug, setCurrentBug] = useState({ description: '', severity: 'medium', feature: '' });

  const steps = [
    { id: 1, title: 'Grunddaten', icon: Smartphone },
    { id: 2, title: 'Gesamtbewertung', icon: Star },
    { id: 3, title: 'Exercise Library', icon: Target },
    { id: 4, title: 'VBT Tracking', icon: Zap },
    { id: 5, title: 'Bar Tracking', icon: TrendingUp },
    { id: 6, title: 'AI Coach', icon: Brain },
    { id: 7, title: 'UX & Performance', icon: Smartphone },
    { id: 8, title: 'Mobile Features', icon: Smartphone },
    { id: 9, title: 'Beta Features', icon: CheckCircle },
    { id: 10, title: 'Nutzungsszenarien', icon: Target },
    { id: 11, title: 'Edge Cases', icon: AlertTriangle },
    { id: 12, title: 'Offenes Feedback', icon: MessageCircle },
    { id: 13, title: 'Bug Reports', icon: Bug }
  ];

  const ratingOptions = [
    { value: 'perfect', label: '✅ Perfekt', color: 'text-green-600', description: 'Übertrifft Erwartungen' },
    { value: 'good', label: '✔️ Gut', color: 'text-blue-600', description: 'Funktioniert wie erwartet' },
    { value: 'acceptable', label: '⚠️ Akzeptabel', color: 'text-yellow-600', description: 'Merkbare Schwächen' },
    { value: 'problem', label: '❌ Problem', color: 'text-red-600', description: 'Erhebliche Mängel' },
    { value: 'not_testable', label: '🚫 Nicht testbar', color: 'text-gray-600', description: 'Nicht verfügbar' }
  ];

  const featureCategories = [
    'Exercise Library',
    'VBT Tracking', 
    'Bar Tracking',
    'Workout Planning',
    'Progress Tracking',
    'Profile & Personalization',
    'Notifications & Settings',
    'UI/UX & Design',
    'AI Coach',
    'UX/Interface',
    'Performance',
    'Mobile Features',
    'General',
    'Sonstiges'
  ];

  const categories = featureCategories;

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    setHoverRating(0);
  };

  const severityLevels = [
    { value: 'low', label: 'Niedrig', color: 'text-green-600' },
    { value: 'medium', label: 'Mittel', color: 'text-yellow-600' },
    { value: 'high', label: 'Hoch', color: 'text-red-600' },
    { value: 'critical', label: 'Kritisch', color: 'text-red-800' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarRating = (field, rating) => {
    setFormData(prev => ({
      ...prev,
      [field]: rating
    }));
  };

  const handleAddBug = () => {
    if (currentBug.description.trim()) {
      setFormData(prev => ({
        ...prev,
        bugs: [...prev.bugs, { ...currentBug, id: Date.now() }]
      }));
      setCurrentBug({ description: '', severity: 'medium', feature: '' });
    }
  };

  const handleRemoveBug = (bugId) => {
    setFormData(prev => ({
      ...prev,
      bugs: prev.bugs.filter(bug => bug.id !== bugId)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const calculateProgress = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Comprehensive Beta Feedback submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Vielen Dank!
        </h2>
        <p className="text-gray-600 mb-6">
          Ihr Feedback wurde erfolgreich übermittelt. Wir schätzen Ihre Meinung sehr!
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              rating: 0,
              category: '',
              feedback: '',
              name: '',
              email: ''
            });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Weiteres Feedback senden
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Prometheus Feedback
        </h1>
        <p className="text-gray-600">
          Ihre Meinung ist uns wichtig. Teilen Sie uns Ihr Feedback mit!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bewertung *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || formData.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {formData.rating > 0 && `${formData.rating} von 5 Sternen`}
            </span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Kategorie *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Bitte wählen Sie eine Kategorie</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Feedback Text */}
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Ihr Feedback *
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Teilen Sie uns Ihre Gedanken mit..."
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ihr Name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ihre@email.com"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.rating || !formData.category || !formData.feedback || !formData.name || !formData.email}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Feedback senden
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;