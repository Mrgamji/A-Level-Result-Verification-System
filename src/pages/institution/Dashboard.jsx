import React, { useEffect, useState } from 'react';
import { Users, FileText, ChevronRight, Plus, List, ShieldCheck, CreditCard, Wallet, MessageSquare, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnnouncementModal from '../../components/AnnouncementModal';
import api from '../../utils/api';

const Dashboard = () => {
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalVerifications: 0,
    totalCredits: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const { user } = useAuth();

  const [showTempPasswordAlert, setShowTempPasswordAlert] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchAnnouncements();

    // Update clock every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // Check if password needs to be changed
    if (user && user.role?.toLowerCase() === 'institution' && user.isPasswordChanged === false) {
      setShowPasswordAlert(true);
    }
  }, [user]);


  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [studentStats, creditStats] = await Promise.all([
        api.get('/students/dashboard-stats'),
        api.get('/payments/credits')
      ]);
      console.log("User:", user);

      setStats({
        ...studentStats.data,
        totalCredits: creditStats.data.totalCredits,
      });
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements/dashboard');
      if (response.data.length > 0) {
        setAnnouncements(response.data);
        setShowAnnouncements(true);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
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
    {
      title: 'Buy Credits',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-orange-100 text-orange-600',
      hover: 'hover:bg-orange-600 hover:text-white',
      action: () => navigate('/institution/credits'),
    },
    {
      title: 'Feedback & Complaints',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-pink-100 text-pink-600',
      hover: 'hover:bg-pink-600 hover:text-white',
      action: () => navigate('/institution/feedback'),
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
      label: 'Available Credits',
      value: stats.totalCredits,
      icon: <Wallet className="h-6 w-6" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Verifications',
      value: stats.totalVerifications,
      icon: <FileText className="h-6 w-6" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Spent',
      value: `₦${(stats.totalSpent || 0).toLocaleString()}`,
      icon: <CreditCard className="h-6 w-6" />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <>
         {/* Password Change Alert */}
         {showPasswordAlert && (
        <div className="mb-4 p-3 lg:p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
          <div className="flex-1">
            <p className="text-yellow-800 font-medium">
              For security reasons, please change your temporary password.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  navigate('/institution/change-password');
                  setShowPasswordAlert(false);
                }}
                className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
              >
                Change Password Now
              </button>
              <button
                onClick={() => setShowPasswordAlert(false)}
                className="text-sm text-yellow-800 hover:text-yellow-900 transition-colors"
              >
                Remind Me Later
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordAlert(false)}
            className="text-yellow-600 hover:text-yellow-800 ml-2"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}
      <div className="space-y-6">

        {/* Header with Welcome and Time */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
              Welcome{user?.institutionName ? `, ${user.institutionName}` : ''}!
            </h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              Here's what's happening with your institution today
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 w-full sm:w-auto">
            <div className="text-lg lg:text-2xl font-semibold text-gray-800 text-center lg:text-left">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs lg:text-sm text-gray-500 text-center lg:text-left">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 lg:p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm lg:text-base text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-32 lg:min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`p-3 lg:p-5 rounded-lg lg:rounded-xl shadow-sm border border-gray-100 ${card.bg} transition-all hover:shadow-md`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs lg:text-sm font-medium text-gray-600">{card.label}</p>
                      <p className="mt-1 text-lg lg:text-2xl font-semibold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`p-1.5 lg:p-2 rounded-lg ${card.color} bg-white bg-opacity-50`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className={`flex items-center justify-between p-3 lg:p-4 rounded-lg border border-gray-100 ${action.color} ${action.hover} transition-all hover:shadow-md group`}
                  >
                    <div className="flex items-center">
                      <div className={`p-1.5 lg:p-2 rounded-md ${action.color.replace('text', 'bg').replace('600', '100')} group-hover:bg-opacity-20 mr-2 lg:mr-3`}>
                        {action.icon}
                      </div>
                      <span className="text-sm lg:text-base font-medium">{action.title}</span>
                    </div>
                    <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 opacity-70 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {/* Placeholder for recent activity items */}
                <div className="p-4 lg:p-5">
                  <div className="flex items-center justify-center py-6 lg:py-8 text-gray-400">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    <span className="text-sm lg:text-base">No recent activity yet</span>
                  </div>
                </div>
              </div>
              <div className="p-3 lg:p-4 bg-gray-50 text-center sm:text-right">
                <button
                  onClick={() => navigate('/institution/credits')}
                  className="text-xs lg:text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all activity →
                </button>
              </div>
            </div>
          </>
        )}



        {/* Announcements Modal */}
        <AnnouncementModal
          isOpen={showAnnouncements}
          onClose={() => setShowAnnouncements(false)}
          announcements={announcements}
        />
      </div>
    </>
  );
};

export default Dashboard;