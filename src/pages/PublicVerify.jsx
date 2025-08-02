import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CreditCard, CheckCircle, XCircle, AlertTriangle, Shield, Users, FileText } from 'lucide-react';
import api from '../utils/api';

const PublicVerify = () => {
  const [activeTab, setActiveTab] = useState('purchase');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Purchase Token State
  const [purchaseData, setPurchaseData] = useState({
    email: '',
    phoneNumber: '',
    fullName: '',
    organization: '',
    purpose: 'verification'
  });
  const [purchaseResult, setPurchaseResult] = useState(null);

  // Verification State
  const [verificationData, setVerificationData] = useState({
    tokenCode: '',
    certificateNumber: '',
    certificateType: '',
    yearOfGraduation: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);

  const certificateTypes = [
    'IJMB',
    'JUPEB', 
    'NCE',
    'OND',
    'HND',
    'PGD',
    'PGDE',
    'A-Level WAEC (GCE)',
    'Cambridge A-Level',
    'NABTEB A-Level',
    'NBTE (Pre-ND)',
    'Other Nigerian A-Level Results'
  ];

  const purposes = [
    { value: 'employment', label: 'Employment Verification' },
    { value: 'admission', label: 'University Admission' },
    { value: 'scholarship', label: 'Scholarship Application' },
    { value: 'verification', label: 'General Verification' },
    { value: 'other', label: 'Other Purpose' }
  ];

  const navigate = useNavigate();

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/public/purchase-token', purchaseData);
      setPurchaseResult(response.data);
      setSuccess('Token purchased successfully! Check your email for details.');
      
      // Auto switch to verification tab after purchase
      setTimeout(() => {
        setActiveTab('verify');
        setVerificationData(prev => ({
          ...prev,
          tokenCode: response.data.tokenCode
        }));
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to purchase token');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/public/verify-certificate', verificationData);
      setVerificationResult(response.data);
      
      if (response.data.success) {
        setSuccess('Certificate verified successfully!');
      } else {
        setError(response.data.message || 'Certificate verification failed');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      setVerificationResult(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'purchase') {
      setPurchaseData(prev => ({ ...prev, [name]: value }));
    } else {
      setVerificationData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  // Navigation handlers using react-router-dom's useNavigate
  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 -mt-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Public Certificate Verification</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Verify any A-Level certificate in Nigeria with our secure token-based system
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CreditCard className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Purchase Token</h3>
                <p className="text-xs text-blue-100">₦500 per verification</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Search className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Enter Details</h3>
                <p className="text-xs text-blue-100">Certificate info & token</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Get Results</h3>
                <p className="text-xs text-blue-100">Instant verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('purchase')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'purchase'
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="h-4 w-4 inline mr-2" />
              Purchase Token
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'verify'
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Verify Certificate
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {success && (
            <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          )}

          {/* Purchase Token Tab */}
          {activeTab === 'purchase' && (
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Purchase Verification Token</h2>
                <p className="text-gray-600">
                  Get a verification token for ₦500 to verify any A-Level certificate. Token is valid for 30 days.
                </p>
              </div>

              {purchaseResult ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Token Purchased Successfully!</h3>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Your Verification Token:</p>
                    <div className="font-mono text-2xl font-bold text-green-700 bg-green-50 p-3 rounded border-2 border-dashed border-green-300">
                      {purchaseResult.tokenCode}
                    </div>
                  </div>
                  <p className="text-green-700 mb-4">
                    Token details have been sent to your email. Use this token to verify certificates.
                  </p>
                  <button
                    onClick={() => setActiveTab('verify')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors"
                  >
                    Verify Certificate Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePurchaseSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={purchaseData.fullName}
                        onChange={(e) => handleInputChange(e, 'purchase')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={purchaseData.email}
                        onChange={(e) => handleInputChange(e, 'purchase')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={purchaseData.phoneNumber}
                        onChange={(e) => handleInputChange(e, 'purchase')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="+234 xxx xxx xxxx"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization (Optional)
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={purchaseData.organization}
                        onChange={(e) => handleInputChange(e, 'purchase')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Company, University, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose of Verification *
                    </label>
                    <select
                      name="purpose"
                      value={purchaseData.purpose}
                      onChange={(e) => handleInputChange(e, 'purchase')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      {purposes.map(purpose => (
                        <option key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-900">Token Price</h4>
                        <p className="text-green-700 text-sm">Valid for 30 days from purchase</p>
                      </div>
                      <div className="text-2xl font-bold text-green-700">₦500</div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Purchase Token - ₦500
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Verify Certificate Tab */}
          {activeTab === 'verify' && (
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Verify A-Level Certificate</h2>
                <p className="text-gray-600">
                  Enter your token code and certificate details to verify authenticity.
                </p>
              </div>

              {verificationResult ? (
                <div className={`border rounded-lg p-6 ${
                  verificationResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center mb-4">
                    {verificationResult.success ? (
                      <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600 mr-3" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${
                        verificationResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {verificationResult.success ? 'Certificate Verified' : 'Verification Failed'}
                      </h3>
                      <p className={`text-sm ${
                        verificationResult.success ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {verificationResult.message}
                      </p>
                    </div>
                  </div>

                  {verificationResult.success && verificationResult.data && (
                    <div className="bg-white rounded-lg p-6 mt-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Certificate Details</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Student Name</span>
                            <p className="text-gray-900 font-semibold">{verificationResult.data.fullName}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Institution</span>
                            <p className="text-gray-900">{verificationResult.data.institution}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Department</span>
                            <p className="text-gray-900">{verificationResult.data.department}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Certificate Type</span>
                            <div className="mt-1">
                              <span className="bg-green-800 text-white px-3 py-1 rounded-full text-sm">
                                {verificationResult.data.certificateType}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Class of Degree</span>
                            <p className="text-gray-900 font-semibold">{verificationResult.data.classOfDegree}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Academic Period</span>
                            <p className="text-gray-900">{verificationResult.data.yearOfEntry} - {verificationResult.data.yearOfGraduation}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Verification completed on {new Date(verificationResult.data.verificationDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {verificationResult.tokenUsed && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-yellow-800 text-sm">
                          A Certificate is not found with the details you supplied, Kindly attempt verifying again.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setVerificationResult(null);
                        setVerificationData({
                          tokenCode: '',
                          certificateNumber: '',
                          certificateType: '',
                          yearOfGraduation: ''
                        });
                      }}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors mr-4"
                    >
                      Verify Another
                    </button>
                    <button
                      onClick={() => setActiveTab('purchase')}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Purchase New Token
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Token *
                    </label>
                    <input
                      type="text"
                      name="tokenCode"
                      value={verificationData.tokenCode}
                      onChange={(e) => handleInputChange(e, 'verify')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-lg"
                      placeholder="PUB-XXXXXXXXX-XXXX"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certificate Number *
                      </label>
                      <input
                        type="text"
                        name="certificateNumber"
                        value={verificationData.certificateNumber}
                        onChange={(e) => handleInputChange(e, 'verify')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter certificate number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Graduation *
                      </label>
                      <input
                        type="number"
                        name="yearOfGraduation"
                        value={verificationData.yearOfGraduation}
                        onChange={(e) => handleInputChange(e, 'verify')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        min="1950"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Type *
                    </label>
                    <select
                      name="certificateType"
                      value={verificationData.certificateType}
                      onChange={(e) => handleInputChange(e, 'verify')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="">Select certificate type</option>
                      {certificateTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying Certificate...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Verify Certificate
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 rounded-lg p-2 mr-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Secure Verification</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Token-based system ensures secure verification with complete audit trails.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Trusted Platform</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Used by leading companies and universities for reliable verification.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 rounded-lg p-2 mr-3">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Database</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Access to certificates from all major institutions and exam bodies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVerify;