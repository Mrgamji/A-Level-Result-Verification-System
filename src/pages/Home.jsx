import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Users, FileText, Search, ArrowRight, Globe, Lock, Database } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Certificate Verification',
      description: 'Certificates are stored securely and can be verified online, reducing the risk of forgery compared to traditional paper-based methods.'
    },
    {
      icon: Database,
      title: 'Centralized A-Level Records',
      description: 'A single platform for Nigerian institutions to upload, manage, and verify A-Level results such as IJMB, JUPEB, NCE, OND, HND, and more.'
    },
    {
      icon: Users,
      title: 'Institution & Admin Dashboards',
      description: 'Dedicated dashboards for institutions and administrators to manage student records, review verification requests, and monitor activity.'
    },
    {
      icon: Globe,
      title: 'Fast Online Validation',
      description: 'Employers, NYSC, and universities can quickly verify certificate authenticity online, streamlining admission and employment processes.'
    }
  ];


  const stats = [
    { number: '1,200+', label: 'Accredited Institutions' },
    { number: '3.8M+', label: 'Certificates Processed' },
    { number: '120K+', label: 'Monthly Verifications' },
    { number: '100%', label: 'Fraud Detection' }
  ];

  return (
    <div className="min-h-screen">
 {/* Hero Section */}
<section className="relative bg-gradient-to-br from-green-900 via-green-800 to-blue-900 text-white overflow-hidden">
  {/* Water flow animation elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-green-600 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute right-0 top-1/2 w-64 h-64 bg-teal-500 rounded-full filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
  </div>

  {/* Floating bubbles */}
  {[...Array(15)].map((_, i) => (
    <div 
      key={i}
      className="absolute rounded-full bg-white/10"
      style={{
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 15 + 10}s linear infinite`,
        animationDelay: `${Math.random() * 5}s`
      }}
    ></div>
  ))}

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
    <div className="text-center">
      <div className="flex justify-center mb-8">
        <div className="bg-white/20 backdrop-blur-md rounded-full p-3 flex items-center justify-center shadow-lg border border-white/10 hover:scale-105 transition-transform duration-300">
          <img 
            src='/uploads/logo.png' 
            alt="Nigerian A-Level Verification System Logo"
            className="h-20 w-20 object-contain" 
          />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        <span className="block text-green-300 bg-clip-text bg-gradient-to-r from-green-300 to-teal-200 animate-text-shimmer">
          Nigerian A-Level Certificate
        </span>
        <span className="block bg-clip-text bg-gradient-to-r from-white to-gray-200 animate-text-shimmer animation-delay-200">
          Verification Platform
        </span>
      </h1>
      
      <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
        Secure, reliable, and instant verification of advanced level qualifications across Nigeria
      </p>

      <div className="mt-8 mb-12">
        <span className="text-lg font-semibold text-green-200 mb-4 inline-block">
          Verifiable A-Level Certificates:
        </span>
        <div className="flex flex-wrap justify-center gap-3 text-base">
          {['IJMB', 'JUPEB', 'NCE', 'OND', 'HND', 'PGD', 'PGDE', 'A-Level WAEC (GCE)', 'Cambridge A-Level', 'NABTEB A-Level', 'NBTE (Pre-ND)', 'Other Nigerian A-Level Results'].map((cert, index) => (
            <span 
              key={cert}
              className="bg-green-800/80 hover:bg-green-700 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-green-500/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="mt-16">
        <h3 className="text-lg font-semibold text-green-100 mb-6 tracking-wide uppercase relative inline-block">
          <span className="relative z-10 px-2">Trusted By</span>
          <span className="absolute left-0 right-0 h-px bg-green-700/50 top-1/2 -translate-y-1/2 z-0"></span>
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {/* JAMB */}
          <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
            <div className="bg-white p-3 rounded-xl shadow-lg border border-white/10">
              <img
                src="/uploads/jamb.png"
                alt="JAMB Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <span className="mt-3 text-sm text-green-50 font-medium">JAMB</span>
          </div>
          
          {/* Federal Ministry of Education */}
          <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
            <div className="bg-white p-3 rounded-xl shadow-lg border border-white/10">
              <img
                src="/uploads/min.png"
                alt="Federal Ministry of Education Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <span className="mt-3 text-sm text-green-50 font-medium text-center">Federal Ministry of Education</span>
          </div>
          
          {/* WAEC */}
          <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
            <div className="bg-white p-3 rounded-xl shadow-lg border border-white/10">
              <img
                src="/uploads/waec.png"
                alt="WAEC Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <span className="mt-3 text-sm text-green-50 font-medium">WAEC</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Add these to your global CSS or style tag */}
  <style jsx>{`
    @keyframes blob {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(20px, -30px) scale(1.05);
      }
      50% {
        transform: translate(0, 20px) scale(0.95);
      }
      75% {
        transform: translate(-20px, -15px) scale(1.03);
      }
    }
    @keyframes float {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(20px);
        opacity: 0;
      }
    }
    @keyframes text-shimmer {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    .animate-blob {
      animation: blob 15s infinite ease-in-out;
    }
    .animate-text-shimmer {
      background-size: 300% 300%;
      animation: text-shimmer 8s ease infinite;
    }
    .animation-delay-200 {
      animation-delay: 200ms;
    }
    .animation-delay-400 {
      animation-delay: 400ms;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `}</style>
</section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solving Nigeria's A-Level Certificate Verification Challenges
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform addresses critical issues in Nigeria's education sector: certificate forgery, manual verification delays, and lack of centralized records for advanced level qualifications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-green-100 rounded-lg p-3 w-fit mb-6">
                  <feature.icon className="h-8 w-8 text-green-600" />
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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Verification Process
            </h2>
            <p className="text-xl text-gray-600">
              Designed specifically for Nigeria's education ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Institution & Exam Body Onboarding
              </h3>
              <p className="text-gray-600">
                Accredited schools and recognized exam bodies (e.g JUPEB, NABTEB, IJMB etc) are vetted and registered on our platform, ensuring only legitimate institutions can upload certificate records.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Certificate Data Submission & Validation
              </h3>
              <p className="text-gray-600">
                Institutions securely upload candidate certificate data via our encrypted portal. Each record is automatically cross-checked with official exam body databases to detect forgeries and inconsistencies.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Real-Time Certificate Verification
              </h3>
              <p className="text-gray-600">
                Employers, universities, NYSC, and JAMB can instantly verify A-Level certificates by entering candidate details or uploading documents. The system provides immediate, tamper-proof verification results with official digital stamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Nigerian Institutions
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">University of Lagos</h3>
              </div>
              <p className="text-gray-600 italic">
                "This system has reduced our admission verification time from 3 weeks to 3 minutes, significantly improving our screening process."
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Federal Ministry of Education</h3>
              </div>
              <p className="text-gray-600 italic">
                "A game-changer in our fight against certificate forgery. Now integrated into our national education quality assurance framework."
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">GTBank HR Department</h3>
              </div>
              <p className="text-gray-600 italic">
                "We've eliminated fake certificate incidents in our graduate trainee program since adopting this verification platform."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Nigeria's Certificate Integrity Revolution
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Be part of the national movement restoring trust in Nigerian educational qualifications
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/institution/activate"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors"
            >
              Register Your Institution
            </Link>
            <Link
              to="/verify"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Verify a Certificate Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;