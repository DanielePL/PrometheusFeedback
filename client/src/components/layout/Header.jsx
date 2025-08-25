import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Settings } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-prometheus-gray border-b border-prometheus-gray-light sticky top-0 z-50 safe-area-top">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-prometheus-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-prometheus-orange font-bold text-lg">Prometheus</h1>
              <p className="text-xs text-gray-400 -mt-1">Feedback</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-prometheus-orange text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-prometheus-gray-light'
              }`}
              aria-label="Home"
            >
              <Home size={20} />
            </Link>
            
            <Link
              to="/feedback"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/feedback') 
                  ? 'bg-prometheus-orange text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-prometheus-gray-light'
              }`}
              aria-label="Feedback geben"
            >
              <MessageSquare size={20} />
            </Link>
            
            <Link
              to="/admin"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/admin') 
                  ? 'bg-prometheus-orange text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-prometheus-gray-light'
              }`}
              aria-label="Admin-Bereich"
            >
              <Settings size={20} />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
