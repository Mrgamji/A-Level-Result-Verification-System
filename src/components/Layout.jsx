import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '/src/contexts/AuthContext';
import {
  LogOut,
  Shield,
  Search,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  // Only show navigation for public pages
  const isPublicPage = ['/', '/verify', '/institution/activate', '/login', '/public-verify'].includes(location.pathname);

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
      { name: 'Verify', href: '/public-verify', icon: Search },
      { name: 'Verify as institution', href: '/verify', icon: Search },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2 flex-shrink-0"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <img
                    src="/uploads/logo.png"
                    alt="A-Level Verification Logo"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <span className="text-lg lg:text-xl font-bold text-gray-900 hidden sm:block">
                  A-Level Verification
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation
                .filter(item => !user || item.name !== 'Home')
                .map((item, idx) => (
                  <React.Fragment key={item.name}>
                    {user && item.dashboard ? (
                      <Link
                        to={item.href}
                        className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ) : (
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/institution/activate"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Activate
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navigation
                  .filter(item => !user || item.name !== 'Home')
                  .map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        user && item.dashboard
                          ? 'bg-blue-600 text-white'
                          : isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/institution/activate"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-center"
                    >
                      Activate Institution
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;