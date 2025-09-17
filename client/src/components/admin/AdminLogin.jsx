import React, { useState } from 'react';
import { Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdmin } from '../../context/AdminContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Bitte E-Mail und Passwort eingeben');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Erfolgreich angemeldet');
      } else {
        toast.error(result.error || 'Login fehlgeschlagen');
      }
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🔥</div>
                <div className="text-center">
                  <span className="text-white font-bold text-2xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent block">
                    Prometheus
                  </span>
                  <span className="text-orange-300 font-medium">
                    Admin
                  </span>
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Admin Access
            </h1>
            <p className="text-gray-400">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-Mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-black/60 border border-gray-600 rounded-lg px-11 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                loading ? 'opacity-70 cursor-not-allowed hover:scale-100' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Development Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-orange-600/20 rounded-lg border border-orange-600/50">
              <div className="text-center">
                <p className="text-xs text-orange-400 mb-2 font-medium">
                  Development Mode
                </p>
                <p className="text-xs text-gray-400">
                  Default password: <code className="text-orange-400 bg-black/50 px-2 py-1 rounded">prometheus_admin_2024</code>
                </p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure Connection • Your data is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
