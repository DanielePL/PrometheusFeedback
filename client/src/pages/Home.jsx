// client/src/pages/Home.jsx - Professional Prometheus Feedback Landing Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Gift, 
  Star, 
  Users, 
  Zap, 
  ChevronRight,
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartFeedback = () => {
    navigate('/feedback');
  };

  const benefits = [
    {
      icon: MessageSquare,
      title: 'Feedback geben',
      description: 'Teile deine Erfahrungen und hilf uns besser zu werden',
      color: 'orange'
    },
    {
      icon: Gift,
      title: '3 Monate Premium',
      description: 'Als Dankeschön für dein Feedback',
      color: 'purple'
    },
    {
      icon: Star,
      title: 'Bewerte Features',
      description: 'Hilf uns zu verstehen, was dir wichtig ist',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Dein Feedback verbessert die App für alle',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Prometheus</h1>
            <p className="text-orange-400 text-sm font-medium">Feedback</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Beta Version</span>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles size={16} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Exklusiver Beta-Zugang</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent">
            Willkommen bei
            <br />
            <span className="text-orange-500">Prometheus</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Deine Meinung ist uns wichtig! Hilf uns dabei, die 
            <span className="text-orange-400 font-semibold"> beste Trainings-App </span>
            zu entwickeln, die es gibt.
          </p>

          <button
            onClick={handleStartFeedback}
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <MessageSquare size={20} />
            <span>Feedback geben</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Reward Section */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-purple-900/20 to-orange-900/20 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Gift size={32} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-4">
              <span className="text-purple-400">Belohnung</span>
            </h2>
            
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Als Dankeschön für dein Feedback erhältst du
              </p>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-orange-500/20 border border-purple-500/30 rounded-xl px-6 py-3">
                <Award size={20} className="text-purple-400" />
                <span className="text-xl font-bold text-white">3 Monate</span>
                <span className="text-purple-400 font-medium">kostenlosen Zugang</span>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                zu unserem Premium-Bereich!
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl font-bold text-center mb-12">
            Warum dein Feedback <span className="text-orange-500">wichtig</span> ist
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const colorClasses = {
                orange: 'from-orange-500 to-orange-600 border-orange-500/20 bg-orange-500/10',
                purple: 'from-purple-500 to-purple-600 border-purple-500/20 bg-purple-500/10',
                yellow: 'from-yellow-500 to-yellow-600 border-yellow-500/20 bg-yellow-500/10',
                blue: 'from-blue-500 to-blue-600 border-blue-500/20 bg-blue-500/10'
              };

              return (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${colorClasses[benefit.color]}`}
                >
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
        </div>

        {/* Features Preview */}
        <div className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl font-bold text-center mb-4">
            Was dich bei <span className="text-orange-500">Prometheus</span> erwartet
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Entdecke die revolutionären Features, die dein Training auf das nächste Level bringen
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-gray-800/50 border border-gray-700 rounded-xl backdrop-blur-sm hover:bg-gray-800/80 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">
              Bereit für die <span className="text-orange-500">Zukunft</span> des Trainings?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Dein Feedback heute formt die Trainings-App von morgen. 
              Sei Teil der Revolution und gestalte Prometheus mit!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartFeedback}
                className="group flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare size={20} />
                <span>Jetzt Feedback geben</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center space-x-2 text-gray-400">
                <Clock size={16} />
                <span className="text-sm">Dauert nur 5 Minuten</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <div>
                <p className="text-white font-medium">Prometheus</p>
                <p className="text-gray-400 text-sm">The Next Generation Performance Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Sicher & Privat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={16} className="text-orange-500" />
                <span>Beta Version</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;