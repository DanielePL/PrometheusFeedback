import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-prometheus-gray border-t border-prometheus-gray-light mt-auto safe-area-bottom">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="text-center space-y-4">
          {/* Brand */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-prometheus-orange rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-prometheus-orange font-medium">Prometheus Feedback</span>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Hilf uns dabei, Prometheus noch besser zu machen. 
            Dein Feedback ist wertvoll für uns.
          </p>

          {/* Quick Links */}
          <div className="flex justify-center space-x-6 text-sm">
            <a 
              href="/feedback" 
              className="text-gray-400 hover:text-prometheus-orange transition-colors"
            >
              Feedback geben
            </a>
            <a 
              href="/admin" 
              className="text-gray-400 hover:text-prometheus-orange transition-colors"
            >
              Admin
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex justify-center space-x-4 pt-2">
            <a 
              href="mailto:feedback@prometheus.app"
              className="text-gray-400 hover:text-prometheus-orange transition-colors p-2"
              aria-label="E-Mail kontakt"
            >
              <Mail size={18} />
            </a>
            <a 
              href="https://github.com/prometheus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-prometheus-orange transition-colors p-2"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-prometheus-gray-light mt-6 pt-4">
          <div className="flex flex-col items-center space-y-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart size={12} className="text-prometheus-orange" />
              <span>for better training</span>
            </div>
            <div>
              © {currentYear} Prometheus. Alle Rechte vorbehalten.
            </div>
          </div>
        </div>

        {/* Version Info (nur in Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mt-4 pt-4 border-t border-prometheus-gray-light">
            <span className="text-xs text-gray-600">
              v1.0.0 - Development Build
            </span>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
