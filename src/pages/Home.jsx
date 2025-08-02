import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Users, FileText, Search, ArrowRight, Globe, Lock, Database, Award, BookOpen, GraduationCap, Star, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'Advanced security protocols ensure authentic certificate verification.',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Database,
      title: 'Centralized Database',
      description: 'Single source of truth for all A-Level certificates across Nigeria.',
      gradient: 'from-purple-500 to-fuchsia-600'
    },
    {
      icon: Users,
      title: 'Institution Management',
      description: 'Streamlined onboarding for educational institutions nationwide.',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Globe,
      title: 'Public Access',
      description: 'Employers can instantly verify certificates through our portal.',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '500+', label: 'Institutions', icon: GraduationCap },
    { number: '2M+', label: 'Certificates', icon: FileText },
    { number: '50K+', label: 'Verifications', icon: CheckCircle },
    { number: '99.9%', label: 'Uptime', icon: Award }
  ];

  const steps = [
    {
      step: '1',
      title: 'Institution Activation',
      description: 'Educational institutions register and get verified by our admin team',
      icon: BookOpen,
      color: 'blue'
    },
    {
      step: '2',
      title: 'Certificate Upload',
      description: 'Institutions upload student data individually or via CSV bulk upload',
      icon: FileText,
      color: 'purple'
    },
    {
      step: '3',
      title: 'Public Verification',
      description: 'Instant verification through our secure public portal',
      icon: Shield,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white rounded-full opacity-5 animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-blue-300 rounded-full opacity-10 animate-bounce" />
          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-green-300 rounded-full opacity-15" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Trusted by 500+ Institutions</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                <span className="block">Nigeria A-Level</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Verification Platform
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
                Secure, instant certificate verification with tamper-proof technology and seamless integration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  to="/institution/activate"
                  className="group bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Activate Institution
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/public-verify"
                  className="group border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Verify Certificate
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center lg:justify-start items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white font-bold text-sm">JAMB</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white font-bold text-sm">WAEC</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white font-bold text-sm">FME</span>
                </div>
              </div>
            </div>

            {/* Certificate Showcase */}
            <div className="relative">
              <div className="relative max-w-sm mx-auto">
                {/* Main Certificate */}
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">A-Level Certificate</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="font-medium">Student:</span> John Doe
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="font-medium">Type:</span> IJMB
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="font-medium">Year:</span> 2023
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <span className="font-medium text-green-700">Grade:</span> 
                        <span className="text-green-700"> Distinction</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Verification Badge */}
                  <div className="absolute -bottom-3 -right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-500 rounded-full opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${
                  index === 0 ? 'bg-blue-100 text-blue-600' :
                  index === 1 ? 'bg-purple-100 text-purple-600' :
                  index === 2 ? 'bg-green-100 text-green-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed for the Nigerian educational ecosystem with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-3 w-fit mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple three-step verification process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                {/* Step Number */}
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                  item.color === 'blue' ? 'bg-blue-500' :
                  item.color === 'purple' ? 'bg-purple-500' :
                  'bg-green-500'
                }`}>
                  {item.step}
                </div>

                <div className="bg-white rounded-xl p-6 pt-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                    item.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    item.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Nigeria's Leading Verification Network
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Hundreds of institutions trust our platform. Be part of the movement to eliminate certificate fraud.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/institution/activate"
              className="group bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
            >
              <Building className="h-5 w-5 mr-2" />
              Activate Institution
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/public-verify"
              className="group border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-6">TRUSTED BY LEADING ORGANIZATIONS</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-gray-700">JAMB</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="font-bold text-gray-700">WAEC</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-gray-700">FME</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <span className="font-bold text-gray-700">NECO</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;