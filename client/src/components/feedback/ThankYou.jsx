import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Gift, Star, Home, MessageSquare } from 'lucide-react';
import { ui } from '../../utils/helpers';

const ThankYou = () => {
  
  useEffect(() => {
    // Scroll to top when component mounts
    ui.scrollToTop();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-prometheus flex items-center">
      <div className="max-w-md mx-auto px-4 py-8 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold text-white">
              Vielen Dank!
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Ihr Feedback ist uns sehr wertvoll und hilft uns dabei, 
              Prometheus noch besser zu machen.
            </p>
          </motion.div>

          {/* Reward Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="card bg-prometheus-orange/10 border-prometheus-orange/30"
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Gift className="w-12 h-12 text-prometheus-orange" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-prometheus-orange mb-2">
                  Ihre Belohnung
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Als Dankeschön für Ihr wertvolles Feedback erhalten Sie{' '}
                  <strong className="text-prometheus-orange">
                    3 Monate kostenlosen Zugang
                  </strong>{' '}
                  zu unserem Premium-Bereich mit exklusiven Features!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <Star className="w-6 h-6 text-prometheus-orange mx-auto mb-2" />
                  <div className="text-white font-medium">Elite Tracking</div>
                  <div className="text-gray-400">VBT & ROM Analysen</div>
                </div>
                <div className="text-center">
                  <MessageSquare className="w-6 h-6 text-prometheus-orange mx-auto mb-2" />
                  <div className="text-white font-medium">AI Coaching</div>
                  <div className="text-gray-400">Personalisierte Tipps</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white">
              Wie geht es weiter?
            </h3>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3 p-4 bg-prometheus-gray rounded-xl">
                <div className="w-6 h-6 bg-prometheus-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Prüfung Ihres Feedbacks</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Unser Team wertet Ihre Antworten aus und arbeitet an Verbesserungen
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-prometheus-gray rounded-xl">
                <div className="w-6 h-6 bg-prometheus-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Premium-Zugang aktivieren</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Sie erhalten eine E-Mail mit Anweisungen zur Aktivierung
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-prometheus-gray rounded-xl">
                <div className="w-6 h-6 bg-prometheus-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Updates erhalten</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Wir informieren Sie über neue Features basierend auf Ihrem Feedback
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Zurück zur Startseite</span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/feedback"
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Weiteres Feedback geben</span>
                </Link>
              </motion.div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Haben Sie Fragen? Kontaktieren Sie uns unter{' '}
                <a 
                  href="mailto:feedback@prometheus.app" 
                  className="text-prometheus-orange hover:underline"
                >
                  feedback@prometheus.app
                </a>
              </p>
            </div>
          </motion.div>

          {/* Social Sharing (Optional) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="border-t border-prometheus-gray-light pt-6"
          >
            <p className="text-sm text-gray-400 mb-4">
              Helfen Sie anderen, Prometheus zu entdecken:
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Prometheus Training App',
                      text: 'Entdecke die ultimative Training-App mit AI-Coaching!',
                      url: window.location.origin
                    });
                  }
                }}
                className="px-4 py-2 bg-prometheus-gray hover:bg-prometheus-gray-light text-white rounded-lg text-sm transition-colors"
              >
                Teilen
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;
