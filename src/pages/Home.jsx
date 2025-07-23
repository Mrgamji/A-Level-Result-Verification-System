import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Users, FileText, Search, ArrowRight, Globe, Lock, Database, Award, BookOpen, GraduationCap } from 'lucide-react';

// Partner logos (you would replace these with actual image imports)


const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'Advanced security protocols ensure authentic certificate verification with comprehensive audit trails.',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Database,
      title: 'Centralized Database',
      description: 'Single source of truth for all A-Level certificates across Nigeria, eliminating fraud and duplication.',
      gradient: 'from-purple-500 to-fuchsia-600'
    },
    {
      icon: Users,
      title: 'Institution Management',
      description: 'Streamlined onboarding and management system for educational institutions nationwide.',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Globe,
      title: 'Public Access',
      description: 'Employers and universities can instantly verify certificates through our public portal.',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '500+', label: 'Registered Institutions', icon: GraduationCap },
    { number: '2M+', label: 'Verified Certificates', icon: FileText },
    { number: '50K+', label: 'Monthly Verifications', icon: CheckCircle },
    { number: '99.9%', label: 'System Uptime', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-white-900 text-white min-h-[320px] flex items-center overflow-hidden py-6">
        {/* Background Image with Subtle Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/uploads/alevel.png"
            alt="A-Level Certificate"
            className="object-cover w-full h-full opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-900/70 to-white-900/40" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-600 rounded-full opacity-10 blur-2xl" />
          <div className="absolute bottom-1/4 right-0 w-24 h-24 bg-indigo-600 rounded-full opacity-10 blur-2xl" />
          <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white rounded-full opacity-05 blur-xl" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Text Content */}
            <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 text-center lg:text-left">
              {/* Logo/Icon */}
              <div className="inline-flex items-center justify-center p-2 bg-white  rounded-2xl mb-4 border border-white/10">
                <img
                  src="/uploads/logo.png"
                  alt="Platform Logo"
                  className="h-10 w-10 object-contain mr-2"
                  style={{ minWidth: '3rem' }}
                />
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                <span className="block text-blue-100">Nigeria </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                  Advanced Level Verification
                </span>
                <span className="block text-blue-50">Platform</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base md:text-lg text-blue-100 mb-5 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Centralized credential verification with instant validation, 
                tamper-proof security, and seamless institutional integration.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <Link
                  to="/institution/activate"
                  className="relative overflow-hidden group bg-white text-blue-900 px-6 py-2 rounded-xl font-semibold text-base hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Activate Institution
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white-100 to-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  to="/public-verify"
                  className="relative overflow-hidden group border-2 border-blue-300 text-white px-6 py-2 rounded-xl font-semibold text-base hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-blue-500/10"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    Verify Certificate
                  </span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div>
                <div className="text-blue-200 text-xs font-medium uppercase tracking-wider">
                  Trusted by Nigeria's Leading Institutions
                </div>
                <div className="flex justify-center lg:justify-start items-center gap-4 flex-wrap p-2">
                  <img src="/uploads/jamb.png" alt="JAMB" className="h-7 md:h-8 object-contain bg-white rounded-lg opacity-90 hover:opacity-100 transition-opacity" />
                  <img src="/uploads/waec.png" alt="WAEC" className="h-7 md:h-8 object-contain bg-white rounded-lg opacity-90 hover:opacity-100 transition-opacity" />
                  <img src="/uploads/min.png" alt="Ministry of Education" className="h-7 md:h-8 bg-white rounded-lg object-contain opacity-90 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Certificate Showcase (Right Side) */}
            <div className="lg:w-1/2 relative mt-4 lg:mt-0">
              <div className="relative max-w-xs mx-auto">
                {/* Certificate Image with Elegant Frame */}
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/uploads/alevel.png"
                    alt="Sample A-Level Certificate"
                    className="w-full h-auto object-cover"
                  />
                  {/* Glossy Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-green-500 rounded-full opacity-10 blur-lg" />
                <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-indigo-500 rounded-full opacity-10 blur-lg" />
                
                {/* Verification Badge */}
                <div className="absolute -bottom-2 -right-2 bg-white text-blue-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 z-20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  A-Level Verified
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden z-10">
          <svg 
            viewBox="0 0 1200 120" 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              className="fill-current text-blue-800"
            />
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              className="fill-current text-blue-800"
            />
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className="fill-current text-blue-700"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-white py-16 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-opacity-10 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-purple-500' : index === 2 ? 'bg-green-500' : 'bg-amber-500'}`}>
                    <stat.icon className={`h-6 w-6 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-purple-600' : index === 2 ? 'text-green-600' : 'text-amber-600'}`} />
                  </div>
                  <div className="ml-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium text-sm">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-gray-50 py-20 overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white to-gray-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block">
                <span className="relative z-10">Platform Features</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-green-100 opacity-50 -mb-1"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed specifically for the Nigerian educational ecosystem with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-indigo-600 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-3 w-fit mb-6 shadow-md`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block">
                <span className="relative z-10">Verification Process</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-100 opacity-50 -mb-1"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Simple, secure, and efficient three-step process
            </p>
          </div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="hidden md:block absolute top-16 left-1/2 h-2/3 w-1 bg-gradient-to-b from-green-100 to-indigo-100 -ml-px"></div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Institution Activation',
                  description: 'Educational institutions register and get activated by our admin team after verification',
                  icon: BookOpen,
                  color: 'blue'
                },
                {
                  step: '2',
                  title: 'Certificate Upload',
                  description: 'Institutions upload student certificate data individually or via CSV bulk upload',
                  icon: FileText,
                  color: 'purple'
                },
                {
                  step: '3',
                  title: 'Public Verification',
                  description: 'Employers and universities can instantly verify any certificate using our secure portal',
                  icon: Shield,
                  color: 'indigo'
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="relative text-center bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className={`absolute top-0 -mt-5 left-1/2 -ml-5 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-full p-3 w-10 h-10 flex items-center justify-center shadow-md`}>
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <div className={`bg-gradient-to-br from-${item.color}-100 to-${item.color}-50 rounded-lg p-4 w-fit mx-auto mb-6`}>
                    <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-indigo-600 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 inline-block mb-8">
            <Award className="h-12 w-12 mx-auto text-blue-200" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Nigeria's Leading Certificate Verification Network
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Hundreds of institutions already trust our platform to secure their academic credentials. 
            Be part of the movement to eliminate certificate fraud in Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/institution/activate"
              className="relative overflow-hidden group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300"
            >
              <span className="relative z-10">Activate Your Institution</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link
              to="/public-verify"
              className="relative overflow-hidden group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              <span className="relative z-10">Contact Our Team</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;