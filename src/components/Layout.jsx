import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '/src/contexts/AuthContext';
import {
  LogOut,
  Shield,
  Users,
  FileText,
  Search,
  LayoutDashboard,
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Navigation based on role
  const navigation = (() => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Institutions', href: '/admin/institutions', icon: Users },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Verification Logs', href: '/admin/logs', icon: FileText },
      ];
    } else if (user) {
      return [
        { name: 'Students', href: '/institution/students', icon: Users },
        { name: 'Add Student', href: '/institution/add-student', icon: FileText },
        { name: 'Verify Certificate', href: '/verify', icon: Search },
      ];
    } else {
      return [
        { name: 'Home', href: '/', icon: Search },
      ];
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
            <Link
  to={
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user
      ? '/institution/dashboard'
      : '/'
  }
  className="flex items-center space-x-2"
>
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                 A-Level Certificate Verification System
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {user ? (
                <div className="flex items-center space-x-2">
                  {user.role !== 'admin' && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{user.institutionName}</div>
                      <div className="text-xs text-gray-500">{user.accessCode}</div>
                    </div>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/institution/activate"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Activate Institution
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
