import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '/src/contexts/AuthContext';
import {
  LogOut,
  Shield,
  Search,
  LayoutDashboard,
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Only show navigation for public pages
  const isPublicPage = ['/', '/verify', '/institution/activate', '/login'].includes(location.pathname);

  // Don't show layout navigation for dashboard pages
  if (!isPublicPage) {
    return children;
  }

  // Navigation for public pages
  let navigation = [];
  if (user) {
    // If logged in, only show dashboard and then other links (no Home)
    navigation = [
      {
        name: 'Dashboard',
        href: user.role === 'admin' ? '/admin/dashboard' : '/institution/dashboard',
        icon: LayoutDashboard,
        dashboard: true,
      },
      { name: 'Verify Certificate', href: '/verify', icon: Search },
    ];
  } else {
    // If not logged in, show Home and then others
    navigation = [
      { name: 'Home', href: '/', icon: Search },
      { name: 'Public Verify', href: '/public-verify', icon: Search },
      { name: 'Verify Certificate', href: '/verify', icon: Search },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2"
              >
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  A-Level Certificate Verification System
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {navigation
                // If logged in, show dashboard first, then others (excluding Home)
                .filter(item => !user || item.name !== 'Home')
                .map((item, idx) => (
                  <React.Fragment key={item.name}>
                    {/* If logged in and this is dashboard, render as blue button, else as normal nav */}
                    {user && item.dashboard ? (
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ) : (
                      <Link
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
                    )}
                  </React.Fragment>
                ))}

              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
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