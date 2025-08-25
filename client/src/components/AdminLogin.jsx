import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdmin } from '../context/AdminContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Bitte geben Sie ein Passwort ein');
      return;
    }

    setLoading(true);
    try {
      const result = await login(password);
      
      if (result.success) {
        toast.success('Erfolgreich eingeloggt');
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
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 bg-prometheus-orange rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Admin-Bereich
            </h1>
            <p className="text-gray-400">
              Melden Sie sich an, um das Dashboard zu verwenden
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin-Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passwort eingeben..."
                  className="input-field pl-11 pr-11"
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

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Anmelden...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Anmelden</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-prometheus-gray-light">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-400">
                Benötigen Sie Hilfe?
              </p>
              
              <div className="space-y-2 text-xs text-gray-500">
                <p>
                  Kontaktieren Sie den System-Administrator für Zugangsdaten
                </p>
                <p>
                  E-Mail:{' '}
                  <a 
                    href="mailto:admin@prometheus.app" 
                    className="text-prometheus-orange hover:underline"
                  >
                    admin@prometheus.app
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Development Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-prometheus-gray-light rounded-xl border border-yellow-500/20">
              <div className="text-center">
                <p className="text-xs text-yellow-400 mb-2 font-medium">
                  Development Mode
                </p>
                <p className="text-xs text-gray-400">
                  Standard-Passwort: <code className="text-prometheus-orange">prometheus_admin_2024</code>
                </p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Sichere Verbindung • Ihre Daten sind geschützt
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
