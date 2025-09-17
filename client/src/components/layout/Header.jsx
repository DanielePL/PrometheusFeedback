import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Settings, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Fixed top right */}
      <button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-[60] p-3 bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-lg hover:bg-orange-600/20 transition-all duration-300"
        aria-label="Menu"
      >
        {isMenuOpen ? (
          <X size={24} className="text-orange-400" />
        ) : (
          <div className="flex flex-col space-y-1">
            <div className="w-6 h-0.5 bg-orange-400"></div>
            <div className="w-6 h-0.5 bg-orange-400"></div>
            <div className="w-6 h-0.5 bg-orange-400"></div>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={closeMenu}
          />
          
          {/* Dropdown Menu */}
          <div className="fixed top-20 right-6 z-50 bg-black/95 backdrop-blur-sm border border-orange-600/50 rounded-lg min-w-[200px] shadow-xl">
            {/* Navigation Links */}
            <nav className="flex flex-col p-2">
              <Link
                to="/"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive('/') 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-orange-600/20'
                }`}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              
              <Link
                to="/feedback"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive('/feedback') 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-orange-600/20'
                }`}
              >
                <MessageSquare size={20} />
                <span>Give Feedback</span>
              </Link>

              {/* Admin Link */}
              <Link
                to="/admin"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive('/admin') 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-orange-600/20'
                }`}
              >
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
