import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Verify = () => {
  const { user } = useAuth();
  const [certificateNumber, setCertificateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certificateNumber.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/verification/verify', {
        certificateNumber: certificateNumber.trim(),
      });

      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in or not an institution, show access restriction
  if (!user || user.role !== 'institution') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="bg-amber-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Lock className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Certificate Verification Portal
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Access to certificate verification is restricted to registered and approved institutions only.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 mb-2">Why is verification restricted?</h3>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Protects student privacy and data security</li>
                    <li>• Prevents unauthorized access to sensitive information</li>
                    <li>• Ensures only legitimate institutions can verify certificates</li>
                    <li>• Maintains audit trail of all verification activities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">For Institutions</h3>
                <p className="text-blue-700 text-sm mb-4">
                  If you're an educational institution, activate your account to access verification services.
                </p>
                <Link
                  to="/institution/activate"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Activate Institution
                </Link>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">Already Registered?</h3>
                <p className="text-green-700 text-sm mb-4">
                  Log in to your institution account to access the verification portal.
                </p>
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
                >
                  Institution Login
                </Link>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                For technical support or inquiries, contact our admin team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Certificate Verification Portal
          </h1>
          <p className="text-gray-600">
            Enter a certificate number to verify its authenticity and view student details
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="certificateNumber"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter certificate number (e.g., CERT-2024-001234)"
                  required
                />
                <Search className="absolute right-4 top-4 h-6 w-6 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying Certificate...
                </div>
              ) : (
                'Verify Certificate'
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-8 p-6 rounded-lg border-2 ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                {result.success ? (
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`text-lg font-semibold ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Certificate Verified Successfully' : 'Certificate Not Found'}
                  </h3>
                  <p className={`text-sm ${
                    result.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.message}
                  </p>
                  {result.creditsRemaining !== undefined && (
                    <p className="text-sm text-blue-600 mt-1">
                      Credits remaining: {result.creditsRemaining}
                    </p>
                  )}
                </div>
              </div>

              {result.success && result.data && (
                <div className="bg-white rounded-lg p-6 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Certificate Details</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Student Name</span>
                        <p className="text-gray-900 font-semibold">{result.data.fullName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Institution</span>
                        <p className="text-gray-900">{result.data.institution}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Department/Program</span>
                        <p className="text-gray-900">{result.data.department}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Class of Degree</span>
                        <p className="text-gray-900 font-semibold">{result.data.classOfDegree}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Certificate Type</span>
                        <div className="mt-1">
                          <span className="bg-green-800 text-white px-3 py-1 rounded-full text-sm">
                            {result.data.certificateType}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Year of Entry</span>
                        <p className="text-gray-900">{result.data.yearOfEntry}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Year of Graduation</span>
                        <p className="text-gray-900">{result.data.yearOfGraduation}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      This certificate has been verified against our secure database. 
                      Verification performed on {new Date().toLocaleString()}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;