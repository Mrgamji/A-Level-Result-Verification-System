import React, { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
} from 'lucide-react';
import api from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    totalApprovedInstitutions: 0,
    totalPendingInstitutions: 0,
    totalVerifications: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      // You may need to implement this endpoint on your backend
      const res = await api.get('/admin/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      label: 'Total Institutions',
      value: stats.totalInstitutions,
      icon: <Building2 className="h-7 w-7 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="h-7 w-7 text-green-600" />,
      bg: 'bg-green-50',
    },
    {
      label: 'Verified Institutions',
      value: stats.totalApprovedInstitutions,
      icon: <CheckCircle className="h-7 w-7 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Pending Institutions',
      value: stats.totalPendingInstitutions,
      icon: <Clock className="h-7 w-7 text-yellow-600" />,
      bg: 'bg-yellow-50',
    },
    {
      label: 'Total Verifications',
      value: stats.totalVerifications,
      icon: <FileText className="h-7 w-7 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Revenue',
      value: `₦${Number(stats.totalRevenue).toLocaleString()}`,
      icon: <DollarSign className="h-7 w-7 text-orange-600" />,
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`flex items-center p-6 rounded-lg shadow ${card.bg}`}
            >
              <div className="mr-4">{card.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-600">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
