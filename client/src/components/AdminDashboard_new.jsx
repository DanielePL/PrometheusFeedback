import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Download,
  LogOut,
  Activity,
  Star,
  FileText,
  Calendar,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdmin } from '../context/AdminContext';

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
        toast.success(`Export as ${format.toUpperCase()} successful`);
      } else {
        toast.error(result.error || 'Export failed');
      }
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="text-3xl">🔥</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Prometheus Admin</h1>
              <p className="text-gray-400">Feedback Management Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Feedback</p>
                <p className="text-2xl font-bold text-white">{stats?.totalFeedback || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{stats?.completionRate || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold text-white">{stats?.activeSessions || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-black/80 backdrop-blur-sm border border-orange-600/50 rounded-2xl p-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'export', label: 'Export', icon: Download }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && <OverviewTab analyticsData={analyticsData} stats={stats} />}
            {activeTab === 'feedback' && <FeedbackTab sessions={sessions} />}
            {activeTab === 'analytics' && <AnalyticsTab analyticsData={analyticsData} />}
            {activeTab === 'export' && <ExportTab onExport={handleExport} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ analyticsData, stats }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Dashboard Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="space-y-4">
          <h4 className="font-semibold text-orange-400">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Rating</span>
              <span className="text-white font-bold">{stats?.avgRating || 0}/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Responses</span>
              <span className="text-white font-bold">{stats?.totalResponses || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completed Sessions</span>
              <span className="text-white font-bold">{stats?.completedSessions || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h4 className="font-semibold text-orange-400">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">New feedback submitted</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">User session started</span>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-sm">Data export completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feedback Tab Component
const FeedbackTab = ({ sessions }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Feedback Sessions</h3>
      
      <div className="space-y-3">
        {sessions?.slice(0, 10).map((session) => (
          <div key={session.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  Session {session.id?.slice(0, 8)}...
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(session.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                  session.status === 'completed' 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {session.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        )) || (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No feedback sessions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ analyticsData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Analytics Data</h3>
      
      <div className="space-y-4">
        {analyticsData?.map((item) => (
          <div key={item.question_id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">
                {item.questions?.question_text || 'Question'}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  Category: {item.questions?.category || 'General'}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-orange-400 font-bold">
                    {item.avg_rating?.toFixed(1) || 0}/5
                  </span>
                  <span className="text-gray-400 text-sm">
                    {item.total_responses || 0} responses
                  </span>
                </div>
              </div>
            </div>
          </div>
        )) || (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Export Tab Component
const ExportTab = ({ onExport }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Export Data</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onExport('csv')}
          className="bg-green-600/20 border border-green-600/50 rounded-lg p-6 hover:bg-green-600/30 transition-colors text-left"
        >
          <FileText className="w-8 h-8 text-green-400 mb-3" />
          <h4 className="text-white font-semibold mb-2">Export as CSV</h4>
          <p className="text-gray-400 text-sm">Download feedback data in CSV format</p>
        </button>
        
        <button
          onClick={() => onExport('json')}
          className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-6 hover:bg-blue-600/30 transition-colors text-left"
        >
          <Download className="w-8 h-8 text-blue-400 mb-3" />
          <h4 className="text-white font-semibold mb-2">Export as JSON</h4>
          <p className="text-gray-400 text-sm">Download raw data in JSON format</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
