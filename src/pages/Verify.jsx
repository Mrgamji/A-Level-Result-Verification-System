import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Lock,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  Users,
  FileText,
  Info,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const notes = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
    title: "Data Security",
    desc: "All verifications are logged and monitored to ensure the highest level of data protection and compliance with privacy regulations."
  },
  {
    icon: <Info className="h-6 w-6 text-green-600" />,
    title: "Accurate Results",
    desc: "Our system cross-checks certificate numbers against official records, ensuring only authentic certificates are validated."
  },
  {
    icon: <Users className="h-6 w-6 text-purple-600" />,
    title: "Bulk Verification",
    desc: "Easily verify multiple certificates at once using our bulk upload feature. Save time and reduce manual entry errors."
  },
  {
    icon: <FileText className="h-6 w-6 text-amber-600" />,
    title: "Audit Trail",
    desc: "Every verification request is recorded, providing a transparent audit trail for your institution."
  }
];

const Verify = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificateNumber, setCertificateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleVerification = async () => {
    setLoading(true);
    setShowConfirmModal(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!certificateNumber.trim()) return;
    setShowConfirmModal(true);
  };

  // Restricted page if not institution
  if (!user || user.role !== 'institution') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-blue-100">
          <div className="text-center">
            <div className="bg-amber-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow">
              <Lock className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Certificate Verification Portal
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Access is restricted to registered and approved institutions only.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left shadow-sm">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Why Restricted?</h3>
                  <ul className="text-amber-700 text-sm space-y-1 list-disc pl-4">
                    <li>Protects student privacy and data security</li>
                    <li>Prevents unauthorized access to sensitive information</li>
                    <li>Ensures only legitimate institutions can verify certificates</li>
                    <li>Maintains audit trail of all verification activities</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 text-left shadow">
                <h3 className="font-semibold text-blue-900 mb-3">For Institutions</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Activate your account to access verification services.
                </p>
                <Link
                  to="/institution/activate"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow"
                >
                  Activate Institution
                </Link>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-left shadow">
                <h3 className="font-semibold text-green-900 mb-3">Already Registered?</h3>
                <p className="text-green-700 text-sm mb-4">
                  Log in to access the verification portal.
                </p>
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow"
                >
                  Institution Login
                </Link>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              For technical support, contact our admin team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Pane: Verification Form */}
        <div className="flex-1 bg-white rounded-3xl shadow-2xl p-10 border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 rounded-full p-4 flex items-center justify-center shadow">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                  Certificate Verification
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                  Instantly verify the authenticity of any certificate issued by your institution.
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="certificateNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Certificate Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="certificateNumber"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-gray-50"
                    placeholder="e.g., CERT-2024-001234"
                    required
                  />
                  <Search className="absolute right-4 top-4 h-6 w-6 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white py-4 px-6 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold flex justify-center items-center shadow"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Certificate'
                )}
              </button>
            </form>
            {/* Result Section */}
            {result && (
              <div
                className={`mt-8 p-6 rounded-xl border-2 shadow ${
                  result.success
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {result.success ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {result.success ? 'Certificate Verified' : 'Certificate Not Found'}
                    </h3>
                    <p
                      className={`text-sm ${
                        result.success ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
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
  <div className="bg-white rounded-xl p-6 mt-4 shadow-sm border border-gray-100">
    <h4 className="font-semibold text-gray-900 mb-4">Certificate Details</h4>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Detail label="Student Name" value={result.data.fullName} highlight />
        <Detail label="Institution" value={result.data.institution} />
        <Detail label="Department/Program" value={result.data.department} />
      </div>
      <div className="space-y-3">
        <Detail label="Class of Degree" value={result.data.classOfDegree} highlight />
        <Detail
          label="Certificate Type"
          value={
            <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm">
              {result.data.certificateType}
            </span>
          }
        />
        <Detail label="Year of Entry" value={result.data.yearOfEntry} />
        <Detail label="Year of Graduation" value={result.data.yearOfGraduation} />
      </div>
    </div>

    {/* Download Button */}
    {result.downloadUrl && (
      <div className="mt-6">
        <a
          href={`http://localhost:10000${result.downloadUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-xl shadow hover:bg-green-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
          </svg>
          Download Certificate (PDF)
        </a>
      </div>
    )}

    <p className="text-xs text-gray-500 mt-6 pt-4 border-t">
      Verified on {new Date().toLocaleString()}
    </p>
  </div>
)}

              </div>
            )}
          </div>
          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Verification</h2>
                <p className="text-gray-600 mb-6">
                  Even if the certificate number is not found,{' '}
                  <span className="font-semibold text-red-600">one token will be deducted</span>.
                  Please make sure the certificate number is correct before proceeding.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerification}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Right Pane: Bulk Verification & Notes */}
        <div className="w-full md:w-[380px] flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl shadow-2xl p-8 mb-8 border border-blue-200 text-white flex flex-col items-center">
            <FileText className="h-10 w-10 mb-3 text-white/90" />
            <h2 className="text-xl font-bold mb-2 text-white tracking-tight">Bulk Verification</h2>
            <p className="text-white/90 text-sm mb-6 text-center">
              Need to verify many certificates at once? Use our bulk verification tool to upload a list and get instant results.
            </p>
            <button
              onClick={() => navigate('/bulk-verification')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 flex items-center gap-2 transition"
            >
              <Users className="h-5 w-5" />
              Bulk Verification
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Good to Know
            </h3>
            <ul className="space-y-5">
              {notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1">{note.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{note.title}</div>
                    <div className="text-gray-600 text-sm">{note.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for clean details display
const Detail = ({ label, value, highlight }) => (
  <div>
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className={`text-gray-900 ${highlight ? 'font-semibold' : ''}`}>{value}</p>
  </div>
);

export default Verify;
