// client/src/pages/Home.jsx - Prometheus Feedback Campus-Style Landing
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Check, 
  Users, 
  TrendingUp, 
  Award, 
  AlertCircle, 
  X, 
  ArrowRight, 
  BookOpen, 
  Target, 
  Zap, 
  Trophy,
  MessageSquare,
  Gift,
  Star,
  Clock
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [adminClicks, setAdminClicks] = useState(0);
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Secret admin entrance via double-click on logo
  let clickTimeout = null;
  
  const handleLogoClick = () => {
    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      clickTimeout = null;
      console.log('🔥 Secret Admin Access Activated!');
      navigate('/admin');
    } else {
      // First click
      console.log('🔥 First click detected');
      clickTimeout = setTimeout(() => {
        // Single click timeout
        clickTimeout = null;
        console.log('🔥 Single click timeout');
      }, 300);
    }
  };

  const scrollToFeedback = () => {
    console.log('Navigating to feedback form');
    navigate('/feedback');
  };

  const benefits = [
    {
      icon: MessageSquare,
      title: 'Give Feedback',
      description: 'Share your experiences and help us improve',
      color: 'orange'
    },
    {
      icon: Gift,
      title: '3 Months Premium',
      description: 'As a thank you for your feedback',
      color: 'purple'
    },
    {
      icon: Star,
      title: 'Rate Features',
      description: 'Help us understand what matters to you',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Your feedback improves the app for everyone',
      color: 'blue'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Elite Tracking',
      subtitle: 'VBT, ROM, Bar Path Analysis'
    },
    {
      icon: Target,
      title: 'AI Coaching',
      subtitle: 'Personalized Training Plans'
    },
    {
      icon: Users,
      title: 'Campus Community',
      subtitle: 'Masterclasses & Workshops'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      subtitle: 'Detailed Progress Tracking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 relative">
      
      {/* CSS Animation for the burning flame */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes flameFlicker {
          0% { 
            transform: scale(1) rotate(-0.8deg);
            filter: hue-rotate(0deg) brightness(1);
          }
          15% { 
            transform: scale(1.03) rotate(1.2deg);
            filter: hue-rotate(8deg) brightness(1.08);
          }
          30% { 
            transform: scale(0.97) rotate(-0.6deg);
            filter: hue-rotate(-3deg) brightness(0.94);
          }
          45% { 
            transform: scale(1.02) rotate(0.9deg);
            filter: hue-rotate(12deg) brightness(1.12);
          }
          60% { 
            transform: scale(0.99) rotate(-1.1deg);
            filter: hue-rotate(-6deg) brightness(0.96);
          }
          75% { 
            transform: scale(1.01) rotate(0.7deg);
            filter: hue-rotate(5deg) brightness(1.06);
          }
          90% { 
            transform: scale(0.98) rotate(-0.4deg);
            filter: hue-rotate(-2deg) brightness(0.98);
          }
          100% { 
            transform: scale(1) rotate(-0.8deg);
            filter: hue-rotate(0deg) brightness(1);
          }
        }
        
        @keyframes flameGlow {
          0% { 
            text-shadow: 0 0 8px rgba(255, 165, 0, 0.7), 0 0 16px rgba(255, 69, 0, 0.5);
          }
          20% { 
            text-shadow: 0 0 12px rgba(255, 165, 0, 0.9), 0 0 24px rgba(255, 69, 0, 0.7), 0 0 32px rgba(255, 140, 0, 0.3);
          }
          40% { 
            text-shadow: 0 0 10px rgba(255, 165, 0, 0.8), 0 0 20px rgba(255, 69, 0, 0.6);
          }
          60% { 
            text-shadow: 0 0 14px rgba(255, 165, 0, 1), 0 0 28px rgba(255, 69, 0, 0.8), 0 0 36px rgba(255, 140, 0, 0.4);
          }
          80% { 
            text-shadow: 0 0 9px rgba(255, 165, 0, 0.75), 0 0 18px rgba(255, 69, 0, 0.55);
          }
          100% { 
            text-shadow: 0 0 8px rgba(255, 165, 0, 0.7), 0 0 16px rgba(255, 69, 0, 0.5);
          }
        }
        
        .burning-flame {
          animation: flameFlicker 4.2s ease-in-out infinite, flameGlow 3.8s ease-in-out infinite;
          transform-origin: bottom center;
        }
        `
      }} />
      
      {/* Secret Admin Dot */}
      <div 
        className="absolute top-4 left-4 w-3 h-3 bg-orange-500 rounded-full cursor-pointer hover:bg-orange-400 transition-colors z-50"
        onClick={() => navigate('/admin')}
        title="Admin Access"
      ></div>
      
      {/* Centered Prometheus Logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300" 
          title="Double-click for secret access"
        >
          <div className="text-5xl burning-flame">🔥</div>
          <div className="text-center">
            <span className="text-white font-bold text-3xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent block">
              Prometheus
            </span>
            <span className="text-orange-300 font-medium text-lg">
              Feedback
            </span>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-600/50 rounded-full px-4 py-2 mb-8">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">Beta Feedback Programm</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight hero-title">
              Your Opinion.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"> Our Future. </span>
              Prometheus Feedback.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto hero-subtitle">
              Help us build the <span className="text-orange-400 font-bold">best fitness app</span> out there. Your feedback shapes the future of Prometheus.
            </p>
            
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto hero-stats">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">5 Min</div>
                <div className="text-gray-400 text-sm">Feedback Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">3 Months</div>
                <div className="text-gray-400 text-sm">Premium Free</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">100%</div>
                <div className="text-gray-400 text-sm">Anonymous</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-cta-buttons">
              <button 
                onClick={scrollToFeedback}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center gap-2 cta-pulse"
              >
                GIVE FEEDBACK NOW
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowLearnMore(true)}
                className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-medium py-4 px-8 rounded-lg text-lg transition-colors"
              >
                Learn More About Prometheus
              </button>
            </div>
            
            <p className="text-orange-300 text-sm mt-4 font-medium">
              ⚡ Your Feedback = Better App for Everyone
            </p>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative p-8">
              {/* Close Button */}
              <button
                onClick={() => setShowLearnMore(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  🔥 Prometheus – The Next Generation Performance & Coaching Platform
                </h2>
                <p className="text-xl text-gray-300">
                  Not just another fitness app. A complete ecosystem for elite performance, AI-powered training, and community.
                </p>
              </div>

              {/* Core Features */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">✅ Elite Tracking</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Velocity-Based Training (VBT)</li>
                    <li>• Range of Motion (ROM) Analysis</li>
                    <li>• Bar Path and Movement Metrics</li>
                    <li>• Auto-regulated Training Adjustments</li>
                    <li>• 1RM Prediction Models</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">✅ AI Coaching Assistant</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Dynamic Plan Adaptation</li>
                    <li>• Personalized Progress Recommendations</li>
                    <li>• Automated Periodization</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">✅ Community & Education</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Monthly Masterclasses</li>
                    <li>• Professional Workshops</li>
                    <li>• Dedicated Leadership Sessions</li>
                    <li>• Referral and Ambassador Programs</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">✅ Monetization Tools</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Affiliate Tracking</li>
                    <li>• Revenue Sharing</li>
                    <li>• White-Label Options for Coaches and Gyms</li>
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">
                  Ready to shape the future of training?
                </h3>
                <p className="text-gray-300 mb-6">
                  Give your feedback now and help us make Prometheus the best fitness app out there.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setShowLearnMore(false);
                      scrollToFeedback();
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center"
                  >
                    GIVE FEEDBACK & GET 3 MONTHS PREMIUM FREE
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowLearnMore(false)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-8 rounded-lg transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Was dich erwartet Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              WHAT TO EXPECT FROM PROMETHEUS
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover the revolutionary features that will take your training to the next level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 benefits-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center hover:border-orange-600/50 transition-colors benefit-card">
                  <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warum Feedback Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                WHY YOUR FEEDBACK MATTERS
              </h2>
              <p className="text-xl text-gray-400">
                You help us develop the best app out there.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 requirements-grid">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const colorClasses = {
                  orange: 'from-orange-500 to-orange-600 border-orange-500/20 bg-orange-500/10',
                  purple: 'from-purple-500 to-purple-600 border-purple-500/20 bg-purple-500/10',
                  yellow: 'from-yellow-500 to-yellow-600 border-yellow-500/20 bg-yellow-500/10',
                  blue: 'from-blue-500 to-blue-600 border-blue-500/20 bg-blue-500/10'
                };

                return (
                  <div key={index} className={`group p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${colorClasses[benefit.color]}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[benefit.color].split(' ')[0]} ${colorClasses[benefit.color].split(' ')[1]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-12 bg-gradient-to-br from-orange-600/20 to-orange-700/10 rounded-lg p-6 border border-orange-600/30 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">WHY JOIN NOW</h3>
              <p className="text-xl text-orange-300 mb-4">Your Voice = Better App for Everyone.</p>
              <div className="grid md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
                <div className="space-y-2">
                  <p className="text-white">• Be one of the first beta testers</p>
                  <p className="text-white">• Help shape the future of Prometheus</p>
                  <p className="text-white">• Get 3 months premium free</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white">• Private training and launch event invitations</p>
                  <p className="text-white">• Direct line to the development team</p>
                  <p className="text-white">• People who join early... always win bigger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-t border-orange-600/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              The Future of Training is Community-Driven.
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Help us build the app you've always wanted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToFeedback}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                GIVE FEEDBACK NOW & GET PREMIUM FREE
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-orange-300 text-sm mt-4 font-medium">
              ⚡ Limited beta spots available
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;