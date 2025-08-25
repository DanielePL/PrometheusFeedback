import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Download,
  LogOut,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Star,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdmin } from '../context/AdminContext';
import { formatters } from '../utils/helpers';

const AdminDashboard = () => {
  const {
    logout,
    analyticsData,
    sessions,
    loadDashboardData,
    getDashboardStats,
    exportData,
    loading
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = getDashboardStats();

  const handleExport = async (format) => {
    try {
      const result = await exportData(format);
      if (result.success) {
        toast.success(`Export als ${format.toUpperCase()} erfolgreich`);
      } else {
        toast.error(result.error || 'Export fehlgeschlagen');
      }
    } catch (error) {
      toast.error('Export fehlgeschlagen');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Erfolgreich abgemeldet');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-prometheus-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Lade Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Prometheus Feedback Verwaltung</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="btn-secondary flex items-center space-x-2"
        >
          <LogOut size={16} />
          <span>Abmelden</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-prometheus-orange/20 rounded-lg">
              <Users className="w-5 h-5 text-prometheus-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Gesamt Sessions</p>
              <p className="text-xl font-bold text-white">{stats.totalSessions}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Abgeschlossen</p>
              <p className="text-xl font-bold text-white">{stats.completedSessions}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Ø Bewertung</p>
              <p className="text-xl font-bold text-white">{stats.avgRating}/5</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Antworten</p>
              <p className="text-xl font-bold text-white">{stats.totalResponses}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-prometheus-gray p-1 rounded-xl">
        {[
          { id: 'overview', label: 'Übersicht', icon: BarChart3 },
          { id: 'sessions', label: 'Sessions', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'export', label: 'Export', icon: Download }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-prometheus-orange text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <OverviewTab analyticsData={analyticsData} stats={stats} />}
        {activeTab === 'sessions' && <SessionsTab sessions={sessions} />}
        {activeTab === 'analytics' && <AnalyticsTab analyticsData={analyticsData} />}
        {activeTab === 'export' && <ExportTab onExport={handleExport} />}
      </motion.div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ analyticsData, stats }) => {
  const topRated = analyticsData
    ?.filter(item => item.avg_rating > 0)
    .sort((a, b) => b.avg_rating - a.avg_rating)
    .slice(0, 3) || [];

  const worstRated = analyticsData
    ?.filter(item => item.avg_rating > 0)
    .sort((a, b) => a.avg_rating - b.avg_rating)
    .slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Completion Rate */}
      <div className="card">
        <h3 className="font-bold text-white mb-4">Abschlussrate</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="bg-prometheus-gray-light rounded-full h-4 overflow-hidden">
              <div 
                className="bg-prometheus-orange h-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <span className="text-white font-medium">{stats.completionRate}%</span>
        </div>
      </div>

      {/* Top Rated Features */}
      <div className="card">
        <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Best bewertete Features</span>
        </h3>
        <div className="space-y-3">
          {topRated.map((item, index) => (
            <div key={item.question_id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white text-sm">{item.questions?.question_text}</p>
                <p className="text-xs text-gray-400">{formatters.formatCategory(item.questions?.category)}</p>
              </div>
              <div className="text-right">
                <p className="text-prometheus-orange font-bold">{item.avg_rating.toFixed(1)}/5</p>
                <p className="text-xs text-gray-400">{item.total_responses} Antworten</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worst Rated Features */}
      <div className="card">
        <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <span>Verbesserungsbedarf</span>
        </h3>
        <div className="space-y-3">
          {worstRated.map((item, index) => (
            <div key={item.question_id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white text-sm">{item.questions?.question_text}</p>
                <p className="text-xs text-gray-400">{formatters.formatCategory(item.questions?.category)}</p>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-bold">{item.avg_rating.toFixed(1)}/5</p>
                <p className="text-xs text-gray-400">{item.total_responses} Antworten</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sessions Tab Component
const SessionsTab = ({ sessions }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">Feedback Sessions</h3>
        <span className="text-sm text-gray-400">{sessions.length} Sessions</span>
      </div>
      
      <div className="space-y-3">
        {sessions.slice(0, 10).map((session) => (
          <div key={session.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  Session {session.id.slice(0, 8)}...
                </p>
                <p className="text-xs text-gray-400">
                  {formatters.formatDate(session.created_at, true)}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  session.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {session.status === 'completed' ? 'Abgeschlossen' : 'Ausstehend'}
                </span>
                {session.completed_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Beendet: {formatters.formatDate(session.completed_at, true)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ analyticsData }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-white">Detaillierte Analytics</h3>
      
      <div className="space-y-3">
        {analyticsData?.map((item) => (
          <div key={item.question_id} className="card">
            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium text-sm mb-1">
                  {item.questions?.question_text}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>{formatters.formatCategory(item.questions?.category)}</span>
                  <span>{formatters.formatQuestionType(item.questions?.question_type)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400">Ø Bewertung</p>
                  <p className="text-prometheus-orange font-bold">{item.avg_rating.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Antworten</p>
                  <p className="text-white font-bold">{item.total_responses}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Positiv</p>
                  <p className="text-green-400 font-bold">{item.positive_count}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Negativ</p>
                  <p className="text-red-400 font-bold">{item.negative_count}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export Tab Component
const ExportTab = ({ onExport }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-white">Daten exportieren</h3>
      
      <div className="space-y-4">
        <div className="card">
          <h4 className="font-medium text-white mb-3">JSON Export</h4>
          <p className="text-sm text-gray-400 mb-4">
            Exportiert alle Feedback-Daten im JSON-Format für weitere Analyse.
          </p>
          <button
            onClick={() => onExport('json')}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Als JSON herunterladen</span>
          </button>
        </div>

        <div className="card">
          <h4 className="font-medium text-white mb-3">CSV Export</h4>
          <p className="text-sm text-gray-400 mb-4">
            Exportiert die Daten als CSV-Datei für Excel oder andere Tabellenkalkulationen.
          </p>
          <button
            onClick={() => onExport('csv')}
            className="btn-primary flex items-center space-x-2"
          >
            <FileText size={16} />
            <span>Als CSV herunterladen</span>
          </button>
        </div>
      </div>

      <div className="bg-prometheus-gray-light rounded-xl p-4">
        <p className="text-xs text-gray-400">
          💡 <strong>Hinweis:</strong> Exportierte Daten enthalten keine persönlichen Informationen wie E-Mail-Adressen.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
