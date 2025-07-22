import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Search, 
  Plus, 
  CreditCard,
  Settings,
  Building,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Institutions', href: '/admin/institutions', icon: Building },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Verification Logs', href: '/admin/logs', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const institutionNavigation = [
    { name: 'Dashboard', href: '/institution/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/institution/students', icon: Users },
    { name: 'Add Student', href: '/institution/add-student', icon: Plus },
    { name: 'Verify Certificate', href: '/verify', icon: Search },
    { name: 'Credits & Payments', href: '/institution/credits', icon: CreditCard },
    { name: 'Feedback & Complaints', href: '/institution/feedback', icon: MessageSquare },
    { name: 'Settings', href: '/institution/settings', icon: Settings },
  ];

  const navigation = user?.role === 'admin' ? adminNavigation : institutionNavigation;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">A-Level</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              {user?.role === 'admin' ? (
                <Shield className="h-5 w-5 text-blue-600" />
              ) : (
                <Building className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.role === 'admin' ? 'System Admin' : user?.institutionName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'admin' ? user?.email : user?.accessCode}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title={isCollapsed ? item.name : ''}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;