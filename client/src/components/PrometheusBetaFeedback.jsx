import React, { useState } from 'react';
import { Star, Send, MessageCircle, Smartphone, Zap, Brain, BookOpen, Bug, Target, ArrowLeft, ArrowRight } from 'lucide-react';

const PrometheusBetaFeedback = () => {
  const [currentSection, setCurrentSection] = useState(0);
  
  const [formData, setFormData] = useState({
    // Basic Info
    testerName: '',
    email: '',
    deviceInfo: '',
    testingDuration: '',
    
    // Feature-specific ratings (1-5 stars)
    exerciseLibrary: {
      overall: 0,
      navigation: 0,
      searchFunction: 0,
      contentQuality: 0,
      loadingSpeed: 0,
      comments: ''
    },
    vbtTracking: {
      overall: 0,
      accuracy: 0,
      realTimeFeedback: 0,
      dataStorage: 0,
      calibration: 0,
      comments: ''
    },
    barTracking: {
      overall: 0,
      motionCapture: 0,
      romAnalysis: 0,
      visualization: 0,
      cameraIntegration: 0,
      comments: ''
    },
    aiCoach: {
      overall: 0,
      recommendations: 0,
      adaptations: 0,
      timing: 0,
      personalization: 0,
      comments: ''
    },
    
    // UX & Technical
    userExperience: {
      design: 0,
      navigation: 0,
      performance: 0,
      responsiveness: 0,
      accessibility: 0,
      comments: ''
    },
    
    // Bugs & Issues
    bugs: {
      crashes: 0,
      loginIssues: 0,
      dataSync: 0,
      performance: 0,
      otherIssues: '',
      severity: 'low'
    },
    
    // Overall Rating
    overall: {
      rating: 0,
      recommendation: 0,
      mostUsefulFeature: '',
      improvementPriorities: '',
      generalComments: ''
    }
  });

  const sections = [
    { id: 'info', title: 'Basic Info', icon: MessageCircle },
    { id: 'exerciseLibrary', title: 'Exercise Library', icon: BookOpen },
    { id: 'vbtTracking', title: 'VBT Tracking', icon: Zap },
    { id: 'barTracking', title: 'Bar Tracking', icon: Target },
    { id: 'aiCoach', title: 'AI Coach', icon: Brain },
    { id: 'userExperience', title: 'User Experience', icon: Smartphone },
    { id: 'bugs', title: 'Bugs & Issues', icon: Bug },
    { id: 'overall', title: 'Overall Rating', icon: Star }
  ];

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const StarRating = ({ rating, onRatingChange, label }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`p-1 rounded transition-colors ${
                star <= rating
                  ? 'text-orange-400 hover:text-orange-300'
                  : 'text-gray-600 hover:text-gray-500'
              }`}
            >
              <Star 
                size={24} 
                fill={star <= rating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-400">
            {rating > 0 ? `${rating}/5` : 'Not rated'}
          </span>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-gray-400">Tell us a bit about yourself and your testing setup</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.testerName}
            onChange={(e) => setFormData(prev => ({ ...prev, testerName: e.target.value }))}
            placeholder="Your name or username"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Device & OS
          </label>
          <input
            type="text"
            value={formData.deviceInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, deviceInfo: e.target.value }))}
            placeholder="e.g., iPhone 14 Pro, iOS 17.0"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            How long have you been testing?
          </label>
          <select
            value={formData.testingDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, testingDuration: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="">Select duration</option>
            <option value="1day">1 day</option>
            <option value="1week">1 week</option>
            <option value="2weeks">2 weeks</option>
            <option value="1month">1 month</option>
            <option value="2months">2+ months</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderExerciseLibrary = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Exercise Library</h2>
        <p className="text-gray-400">Rate the exercise database and search functionality</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          rating={formData.exerciseLibrary.overall}
          onRatingChange={(rating) => updateFormData('exerciseLibrary', 'overall', rating)}
          label="Overall Exercise Library Rating"
        />
        <StarRating
          rating={formData.exerciseLibrary.navigation}
          onRatingChange={(rating) => updateFormData('exerciseLibrary', 'navigation', rating)}
          label="Navigation & User-Friendliness"
        />
        <StarRating
          rating={formData.exerciseLibrary.searchFunction}
          onRatingChange={(rating) => updateFormData('exerciseLibrary', 'searchFunction', rating)}
          label="Search Function"
        />
        <StarRating
          rating={formData.exerciseLibrary.contentQuality}
          onRatingChange={(rating) => updateFormData('exerciseLibrary', 'contentQuality', rating)}
          label="Content Quality & Descriptions"
        />
        <StarRating
          rating={formData.exerciseLibrary.loadingSpeed}
          onRatingChange={(rating) => updateFormData('exerciseLibrary', 'loadingSpeed', rating)}
          label="Loading Speed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Comments & Suggestions
        </label>
        <textarea
          value={formData.exerciseLibrary.comments}
          onChange={(e) => updateFormData('exerciseLibrary', 'comments', e.target.value)}
          rows={4}
          placeholder="What worked well? What could be improved? Missing exercises?"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderVBTTracking = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">VBT Tracking</h2>
        <p className="text-gray-400">Rate the velocity-based training features</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          rating={formData.vbtTracking.overall}
          onRatingChange={(rating) => updateFormData('vbtTracking', 'overall', rating)}
          label="Overall VBT Experience"
        />
        <StarRating
          rating={formData.vbtTracking.accuracy}
          onRatingChange={(rating) => updateFormData('vbtTracking', 'accuracy', rating)}
          label="Tracking Accuracy"
        />
        <StarRating
          rating={formData.vbtTracking.realTimeFeedback}
          onRatingChange={(rating) => updateFormData('vbtTracking', 'realTimeFeedback', rating)}
          label="Real-time Feedback"
        />
        <StarRating
          rating={formData.vbtTracking.dataStorage}
          onRatingChange={(rating) => updateFormData('vbtTracking', 'dataStorage', rating)}
          label="Data Storage & History"
        />
        <StarRating
          rating={formData.vbtTracking.calibration}
          onRatingChange={(rating) => updateFormData('vbtTracking', 'calibration', rating)}
          label="Calibration Process"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Comments & Suggestions
        </label>
        <textarea
          value={formData.vbtTracking.comments}
          onChange={(e) => updateFormData('vbtTracking', 'comments', e.target.value)}
          rows={4}
          placeholder="How accurate was the velocity tracking? Any issues with calibration?"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderBarTracking = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Bar Tracking</h2>
        <p className="text-gray-400">Rate the bar movement analysis features</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          rating={formData.barTracking.overall}
          onRatingChange={(rating) => updateFormData('barTracking', 'overall', rating)}
          label="Overall Bar Tracking"
        />
        <StarRating
          rating={formData.barTracking.motionCapture}
          onRatingChange={(rating) => updateFormData('barTracking', 'motionCapture', rating)}
          label="Motion Capture Quality"
        />
        <StarRating
          rating={formData.barTracking.romAnalysis}
          onRatingChange={(rating) => updateFormData('barTracking', 'romAnalysis', rating)}
          label="Range of Motion Analysis"
        />
        <StarRating
          rating={formData.barTracking.visualization}
          onRatingChange={(rating) => updateFormData('barTracking', 'visualization', rating)}
          label="Movement Visualization"
        />
        <StarRating
          rating={formData.barTracking.cameraIntegration}
          onRatingChange={(rating) => updateFormData('barTracking', 'cameraIntegration', rating)}
          label="Camera Integration"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Comments & Suggestions
        </label>
        <textarea
          value={formData.barTracking.comments}
          onChange={(e) => updateFormData('barTracking', 'comments', e.target.value)}
          rows={4}
          placeholder="How well did the bar tracking work? Camera setup issues?"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderAICoach = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">AI Coach</h2>
        <p className="text-gray-400">Rate the AI coaching features</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          rating={formData.aiCoach.overall}
          onRatingChange={(rating) => updateFormData('aiCoach', 'overall', rating)}
          label="Overall AI Coach Experience"
        />
        <StarRating
          rating={formData.aiCoach.recommendations}
          onRatingChange={(rating) => updateFormData('aiCoach', 'recommendations', rating)}
          label="Quality of Recommendations"
        />
        <StarRating
          rating={formData.aiCoach.adaptations}
          onRatingChange={(rating) => updateFormData('aiCoach', 'adaptations', rating)}
          label="Workout Adaptations"
        />
        <StarRating
          rating={formData.aiCoach.timing}
          onRatingChange={(rating) => updateFormData('aiCoach', 'timing', rating)}
          label="Timing of Feedback"
        />
        <StarRating
          rating={formData.aiCoach.personalization}
          onRatingChange={(rating) => updateFormData('aiCoach', 'personalization', rating)}
          label="Personalization Level"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Comments & Suggestions
        </label>
        <textarea
          value={formData.aiCoach.comments}
          onChange={(e) => updateFormData('aiCoach', 'comments', e.target.value)}
          rows={4}
          placeholder="How helpful were the AI recommendations? Did they feel personalized?"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderUserExperience = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">User Experience</h2>
        <p className="text-gray-400">Rate the overall app usability</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          rating={formData.userExperience.design}
          onRatingChange={(rating) => updateFormData('userExperience', 'design', rating)}
          label="Design & Visual Appeal"
        />
        <StarRating
          rating={formData.userExperience.navigation}
          onRatingChange={(rating) => updateFormData('userExperience', 'navigation', rating)}
          label="Navigation & Menu Structure"
        />
        <StarRating
          rating={formData.userExperience.performance}
          onRatingChange={(rating) => updateFormData('userExperience', 'performance', rating)}
          label="App Performance"
        />
        <StarRating
          rating={formData.userExperience.responsiveness}
          onRatingChange={(rating) => updateFormData('userExperience', 'responsiveness', rating)}
          label="Responsiveness"
        />
        <StarRating
          rating={formData.userExperience.accessibility}
          onRatingChange={(rating) => updateFormData('userExperience', 'accessibility', rating)}
          label="Accessibility"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Comments & Suggestions
        </label>
        <textarea
          value={formData.userExperience.comments}
          onChange={(e) => updateFormData('userExperience', 'comments', e.target.value)}
          rows={4}
          placeholder="What did you like about the design? Any usability issues?"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderBugs = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Bugs & Issues</h2>
        <p className="text-gray-400">Report any problems you encountered</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          rating={formData.bugs.crashes}
          onRatingChange={(rating) => updateFormData('bugs', 'crashes', rating)}
          label="App Crashes (1=many, 5=none)"
        />
        <StarRating
          rating={formData.bugs.loginIssues}
          onRatingChange={(rating) => updateFormData('bugs', 'loginIssues', rating)}
          label="Login Issues (1=many, 5=none)"
        />
        <StarRating
          rating={formData.bugs.dataSync}
          onRatingChange={(rating) => updateFormData('bugs', 'dataSync', rating)}
          label="Data Sync Issues (1=many, 5=none)"
        />
        <StarRating
          rating={formData.bugs.performance}
          onRatingChange={(rating) => updateFormData('bugs', 'performance', rating)}
          label="Performance Issues (1=many, 5=none)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Other Issues
        </label>
        <textarea
          value={formData.bugs.otherIssues}
          onChange={(e) => updateFormData('bugs', 'otherIssues', e.target.value)}
          rows={4}
          placeholder="Describe any other bugs or issues you encountered..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Overall Severity
        </label>
        <select
          value={formData.bugs.severity}
          onChange={(e) => updateFormData('bugs', 'severity', e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
        >
          <option value="low">Low - Minor issues</option>
          <option value="medium">Medium - Affects usability</option>
          <option value="high">High - Major problems</option>
          <option value="critical">Critical - App unusable</option>
        </select>
      </div>
    </div>
  );

  const renderOverall = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Overall Rating</h2>
        <p className="text-gray-400">Your overall impression and recommendations</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          rating={formData.overall.rating}
          onRatingChange={(rating) => updateFormData('overall', 'rating', rating)}
          label="Overall App Rating"
        />
        <StarRating
          rating={formData.overall.recommendation}
          onRatingChange={(rating) => updateFormData('overall', 'recommendation', rating)}
          label="Would Recommend to Others"
        />
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Most Useful Feature
          </label>
          <input
            type="text"
            value={formData.overall.mostUsefulFeature}
            onChange={(e) => updateFormData('overall', 'mostUsefulFeature', e.target.value)}
            placeholder="Which feature did you find most valuable?"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Improvement Priorities
          </label>
          <textarea
            value={formData.overall.improvementPriorities}
            onChange={(e) => updateFormData('overall', 'improvementPriorities', e.target.value)}
            rows={3}
            placeholder="What should we focus on improving first?"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            General Comments
          </label>
          <textarea
            value={formData.overall.generalComments}
            onChange={(e) => updateFormData('overall', 'generalComments', e.target.value)}
            rows={4}
            placeholder="Any final thoughts or suggestions?"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (sections[currentSection].id) {
      case 'info': return renderBasicInfo();
      case 'exerciseLibrary': return renderExerciseLibrary();
      case 'vbtTracking': return renderVBTTracking();
      case 'barTracking': return renderBarTracking();
      case 'aiCoach': return renderAICoach();
      case 'userExperience': return renderUserExperience();
      case 'bugs': return renderBugs();
      case 'overall': return renderOverall();
      default: return renderBasicInfo();
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Feedback submitted:', formData);
    alert('Thank you for your feedback! Your input helps us improve Prometheus.');
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-4xl">🔥</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Prometheus Beta Feedback
              </h1>
              <p className="text-orange-300">Help us build the future of training</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Section {currentSection + 1} of {sections.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    index === currentSection
                      ? 'bg-orange-600 border-orange-500 text-white'
                      : index < currentSection
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Icon size={20} className="mb-1" />
                    <span className="text-xs text-center">{section.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            {renderCurrentSection()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  currentSection === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              <div className="text-center">
                <span className="text-gray-400 text-sm">
                  {sections[currentSection].title}
                </span>
              </div>

              {currentSection === sections.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Send size={20} />
                  Submit Feedback
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrometheusBetaFeedback;