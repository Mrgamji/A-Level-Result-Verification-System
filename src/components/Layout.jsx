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
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HelpCircle,
  BookOpen,
  File,
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
  const navigation = [
    { name: 'Home', href: '/', icon: Search },
    { name: 'Verify Certificate', href: '/verify', icon: Search },
  ];

  // Footer links data
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Verify Certificate', href: '/verify' },
        { name: 'Activate Institution', href: '/institution/activate' },
        { name: 'Login', href: '/login' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs', icon: BookOpen },
        { name: 'FAQs', href: '/faqs', icon: HelpCircle },
        { name: 'Privacy Policy', href: '/privacy', icon: Shield },
        { name: 'Terms of Service', href: '/terms', icon: FileText },
      ],
    },
    {
      title: 'Certificates',
      links: [
        { name: 'IJMB', href: '/certificates/ijmb' },
        { name: 'JUPEB', href: '/certificates/jupeb' },
        { name: 'NCE', href: '/certificates/nce' },
        { name: 'OND/HND', href: '/certificates/ond-hnd' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2"
              >
                <img src='/uploads/logo.png' className="h-6 w-6 object-contain" alt="Logo" />
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
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/institution/dashboard'}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src='/uploads/logo.png' className="h-8 w-8 object-contain" alt="Logo" />
                <span className="text-xl font-bold">A-Level Verification</span>
              </div>
              <p className="text-gray-300">
                The official platform for verifying Nigerian A-Level certificates, endorsed by educational authorities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Footer Links */}
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                      >
                        {link.icon && <link.icon className="h-4 w-4" />}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-300 mt-0.5" />
                  <span className="text-gray-300">support@alevelverify.gov.ng</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-300 mt-0.5" />
                  <span className="text-gray-300">+234 800 123 4567</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-300 mt-0.5" />
                  <span className="text-gray-300">
                    Federal Ministry of Education Complex, Abuja, Nigeria
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-8 mb-6"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Nigerian A-Level Certificate Verification System. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;