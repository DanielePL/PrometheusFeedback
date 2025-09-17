import React, { useState } from 'react';
import { Flame, Menu, X } from 'lucide-react';

const PrometheusHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Flame className="h-8 w-8 text-prometheus-orange animate-flame" />
            <span className="text-xl font-bold bg-gradient-to-r from-prometheus-orange to-prometheus-orange-light bg-clip-text text-transparent">
              Prometheus Beta Feedback
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <span className="text-gray-300 text-sm">
              🚀 Mobile App Beta Test
            </span>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-prometheus-orange transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <span className="text-gray-300 py-2">
                🚀 Mobile App Beta Test
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PrometheusHeader;
