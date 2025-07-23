import React, { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  Bell,
  MessageSquare,
  TrendingUp,
  Activity,
  PieChart as PieChartIcon,
  BarChart2
} from 'lucide-react';
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useFirstLogin } from '../../hooks/useFirstLogin';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import api from '../../utils/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    totalApprovedInstitutions: 0,
    totalPendingInstitutions: 0,
    totalVerifications: 0,
    totalRevenue: 0,
    totalAnnouncements: 0,
    totalFeedback: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isFirstLogin, showPasswordModal, closePasswordModal } = useFirstLogin();
  const [chartData, setChartData] = useState({
    verificationsByInstitution: [],
    successRate: [],
    verificationsOverTime: [],
  });
  
  // Custom colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchDashboardStats();
    fetchChartData();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardRes, announcementsRes, feedbackRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/announcements'),
        api.get('/announcements/feedback')
      ]);
  
      const dashboard = dashboardRes.data.data;
  
      setStats({
        totalInstitutions: dashboard.institutions.total,
        totalApprovedInstitutions: dashboard.institutions.approved,
        totalPendingInstitutions: dashboard.institutions.pending,
        totalStudents: dashboard.students,
        totalVerifications: dashboard.verifications,
        totalRevenue: dashboard.revenue || 0,
        totalAnnouncements: announcementsRes.data.length,
        totalFeedback: feedbackRes.data.filter(f => f.status === 'pending').length,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const [
        instRes,
        statusRes,
        trendRes
      ] = await Promise.all([
        api.get('/admin/chart/verifications-by-institution'),
        api.get('/admin/chart/success-rate'),
        api.get('/admin/chart/verifications-over-time')
      ]);
  
      setChartData({
        verificationsByInstitution: instRes.data || [],
        successRate: statusRes.data || [],
        verificationsOverTime: trendRes.data || [],
      });
    } catch (err) {
      console.error('Chart data load failed:', err);
    }
  };

  const cards = [
    {
      label: 'Total Institutions',
      value: stats.totalInstitutions,
      icon: <Building2 className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-l-blue-500',
      trend: 'up'
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-l-green-500',
      trend: 'up'
    },
    {
      label: 'Verified Institutions',
      value: stats.totalApprovedInstitutions,
      icon: <CheckCircle className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      border: 'border-l-emerald-500',
      trend: 'up'
    },
    {
      label: 'Pending Institutions',
      value: stats.totalPendingInstitutions,
      icon: <Clock className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      border: 'border-l-yellow-500',
      trend: 'neutral'
    },
    {
      label: 'Total Verifications',
      value: stats.totalVerifications,
      icon: <FileText className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-l-purple-500',
      trend: 'up'
    },
    {
      label: 'Total Revenue',
      value: `₦${Number(stats.totalRevenue).toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      border: 'border-l-orange-500',
      trend: 'up'
    },
    {
      label: 'Active Announcements',
      value: stats.totalAnnouncements,
      icon: <Bell className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      border: 'border-l-indigo-500',
      trend: 'neutral'
    },
    {
      label: 'Pending Feedback',
      value: stats.totalFeedback,
      icon: <MessageSquare className="h-5 w-5" />,
      bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
      border: 'border-l-pink-500',
      trend: 'down'
    },
  ];

  const renderTrendIcon = (trend) => {
    switch(trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchDashboardStats} 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-6 rounded-lg shadow border border-gray-200">
              <Skeleton height={20} width={150} />
              <Skeleton height={30} className="mt-2" />
              <div className="flex items-center mt-4">
                <Skeleton circle height={40} width={40} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`p-5 rounded-lg shadow border-l-4 ${card.border} ${card.bg} transition-all hover:shadow-md`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${card.bg.includes('blue') ? 'bg-blue-100' : card.bg.includes('green') ? 'bg-green-100' : card.bg.includes('emerald') ? 'bg-emerald-100' : card.bg.includes('yellow') ? 'bg-yellow-100' : card.bg.includes('purple') ? 'bg-purple-100' : card.bg.includes('orange') ? 'bg-orange-100' : card.bg.includes('indigo') ? 'bg-indigo-100' : 'bg-pink-100'}`}>
                    {card.icon}
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-gray-500">
                  {renderTrendIcon(card.trend)}
                  <span className="ml-1">{card.trend === 'up' ? 'Increased' : card.trend === 'down' ? 'Decreased' : 'No change'} from last week</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
              Platform Analytics
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verifications by Institution */}
              <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-700 flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                    Verifications by Institution
                  </h3>
                  <div className="text-xs text-gray-500">Last 30 days</div>
                </div>
                <div className="h-64">
                  {chartData.verificationsByInstitution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.verificationsByInstitution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="institution" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#3B82F6" 
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No data available
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Success Rate */}
              <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-700 flex items-center">
                    <PieChartIcon className="h-4 w-4 mr-2 text-emerald-500" />
                    Verification Success Rate
                  </h3>
                  <div className="text-xs text-gray-500">Overall</div>
                </div>
                <div className="h-64">
                  {chartData.successRate.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={chartData.successRate} 
                          dataKey="value" 
                          nameKey="status" 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80}
                          innerRadius={60}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {chartData.successRate.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} verifications`, 'Count']}
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No data available
                    </div>
                  )}
                </div>
              </div>

              {/* Verifications Over Time */}
              <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-700 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                    Verifications Over Time
                  </h3>
                  <div className="text-xs text-gray-500">Last 7 days</div>
                </div>
                <div className="h-64">
                  {chartData.verificationsOverTime.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.verificationsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#6366F1" 
                          strokeWidth={2} 
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={closePasswordModal}
        isFirstLogin={isFirstLogin}
      />
    </div>
  );
};

export default Dashboard;