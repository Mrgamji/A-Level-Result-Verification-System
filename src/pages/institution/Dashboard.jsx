import React, { useEffect, useState } from 'react';
import { Users, FileText, Search, CheckCircle, Clock, ChevronRight, Plus, List, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalVerifications: 0,
    totalApproved: 0,
    totalPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
 
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    
    // Update clock every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/students/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format time as HH:MM:SS AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Format date as Weekday, Month Day
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const quickActions = [
    {
      title: 'Add Students',
      icon: <Plus className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600',
      hover: 'hover:bg-blue-600 hover:text-white',
      action: () => navigate('/institution/add-student'),
    },
    {
      title: 'View Students',
      icon: <List className="h-5 w-5" />,
      color: 'bg-emerald-100 text-emerald-600',
      hover: 'hover:bg-emerald-600 hover:text-white',
      action: () => navigate('/institution/students'),
    },
    {
      title: 'Verify Certificate',
      icon: <ShieldCheck className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-600',
      hover: 'hover:bg-purple-600 hover:text-white',
      action: () => navigate('/verify'),
    },
  ];

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Verifications',
      value: stats.totalVerifications,
      icon: <FileText className="h-6 w-6" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Approved',
      value: stats.totalApproved,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Pending',
      value: stats.totalPending,
      icon: <Clock className="h-6 w-6" />,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header with Welcome and Time */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome{user?.institutionName ? `, ${user.institutionName}` : ''}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your institution today
          </p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-semibold text-gray-800">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`p-5 rounded-xl shadow-sm border border-gray-100 ${card.bg} transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${card.color} bg-white bg-opacity-50`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={action.action}
                  className={`flex items-center justify-between p-4 rounded-lg border border-gray-100 ${action.color} ${action.hover} transition-all hover:shadow-md group`}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${action.color.replace('text', 'bg').replace('600', '100')} group-hover:bg-opacity-20 mr-3`}>
                      {action.icon}
                    </div>
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Placeholder for recent activity items */}
              <div className="p-5">
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <FileText className="h-5 w-5 mr-2" />
                  <span>No recent activity yet</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 text-right">
              <button
                onClick={() => navigate('/admin/logs')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all activity →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;