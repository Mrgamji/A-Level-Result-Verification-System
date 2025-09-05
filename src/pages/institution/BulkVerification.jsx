import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Info,
  ArrowRight,
  FileCheck,
  Users,
  Clock
} from 'lucide-react';
import api from '../../utils/api';

const BulkVerification = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    certificateType: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const fileInputRef = useRef(null);

  const steps = [
    {
      number: 1,
      title: 'Download Template',
      description: 'Download the CSV template with the correct format',
      icon: Download,
      color: 'blue'
    },
    {
      number: 2,
      title: 'Fill Certificate Data',
      description: 'Add certificate numbers, types, and graduation years',
      icon: FileText,
      color: 'purple'
    },
    {
      number: 3,
      title: 'Upload CSV File',
      description: 'Upload your completed CSV file for verification',
      icon: Upload,
      color: 'green'
    },
    {
      number: 4,
      title: 'Review Results',
      description: 'View verification results and download report',
      icon: FileCheck,
      color: 'orange'
    }
  ];

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        setError('Please select a CSV file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setCurrentStep(3);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await api.post('/verification/bulk-verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data.results || []);
      setSuccess(`Verification completed! ${response.data.summary?.verified || 0} certificates verified.`);
      setShowResults(true);
      setCurrentStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Bulk verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (results.length === 0) {
      setError('No results to download');
      return;
    }

    try {
      const response = await api.post('/verification/download-report', 
        { results },
        { 
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `verification-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF report');
    }
  };

  const handleViewResults = () => {
    setShowResults(true);
    setViewMode('table');
  };

  const resetForm = () => {
    setFile(null);
    setResults([]);
    setShowResults(false);
    setCurrentStep(1);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter results
  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.certificateNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
      result.studentName?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status ? 
      (filters.status === 'verified' ? result.verified : !result.verified) : true;
    const matchesType = filters.certificateType ? 
      result.certificateType === filters.certificateType : true;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStepColor = (stepNumber) => {
    const step = steps.find(s => s.number === stepNumber);
    const colors = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500'
    };
    return colors[step?.color] || 'bg-gray-500';
  };

  const getStepTextColor = (stepNumber) => {
    const step = steps.find(s => s.number === stepNumber);
    const colors = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600'
    };
    return colors[step?.color] || 'text-gray-600';
  };

  const getStepBgColor = (stepNumber) => {
    const step = steps.find(s => s.number === stepNumber);
    const colors = {
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      green: 'bg-green-50',
      orange: 'bg-orange-50'
    };
    return colors[step?.color] || 'bg-gray-50';
  };

  const summary = results.length > 0 ? {
    total: results.length,
    verified: results.filter(r => r.verified).length,
    failed: results.filter(r => !r.verified).length,
    successRate: results.length > 0 ? ((results.filter(r => r.verified).length / results.length) * 100).toFixed(1) : 0
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bulk Certificate Verification</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Verify multiple certificates at once using CSV upload
              </p>
            </div>
            {results.length > 0 && (
              <button
                onClick={resetForm}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Start New Verification
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Step-by-Step Guide */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                  <Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Verification Guide</h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="relative">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        currentStep >= step.number ? getStepColor(step.number) : 'bg-gray-300'
                      }`}>
                        {currentStep > step.number ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <div className="ml-3 sm:ml-4 flex-1">
                        <h3 className={`font-semibold text-sm sm:text-base ${
                          currentStep >= step.number ? getStepTextColor(step.number) : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {step.description}
                        </p>
                        
                        {/* Step-specific content */}
                        {step.number === 1 && (
                          <div className="mt-3">
                            <a
                              href="/uploads/bulk_verification_template.csv"
                              download
                              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                              onClick={() => setCurrentStep(2)}
                            >
                              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Download Template
                            </a>
                          </div>
                        )}
                        
                        {step.number === 3 && currentStep >= 3 && (
                          <div className="mt-3">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".csv"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                            >
                              <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Select CSV File
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-4 sm:left-5 top-8 sm:top-10 w-0.5 h-4 sm:h-6 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* CSV Format Guide */}
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">CSV Format Required:</h4>
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <div>• <strong>certificateNumber</strong> - Certificate ID</div>
                  <div>• <strong>certificateType</strong> - Type of certificate</div>
                  <div>• <strong>yearOfGraduation</strong> - Graduation year</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Status Messages */}
              {error && (
                <div className="m-4 sm:m-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="m-4 sm:m-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800 text-sm">{success}</span>
                </div>
              )}

              {!showResults ? (
                /* Upload Section */
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                      Upload Certificates for Verification
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                      Upload a CSV file containing certificate details to verify multiple certificates at once
                    </p>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 mb-6 hover:border-blue-400 transition-colors">
                      {file ? (
                        <div className="text-center">
                          <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-3 sm:mb-4" />
                          <p className="text-sm sm:text-base font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • Ready to upload
                          </p>
                          <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Change File
                            </button>
                            <button
                              onClick={handleUpload}
                              disabled={loading}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                            >
                              {loading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <Search className="h-4 w-4 mr-2" />
                                  Start Verification
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                          <p className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                            Drop your CSV file here or click to browse
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mb-4">
                            Maximum file size: 5MB
                          </p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                          >
                            Select CSV File
                          </button>
                        </div>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Requirements */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 text-left">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-amber-800 text-sm sm:text-base">Important Requirements:</h4>
                          <ul className="text-xs sm:text-sm text-amber-700 mt-2 space-y-1">
                            <li>• CSV file must contain: certificateNumber, certificateType, yearOfGraduation</li>
                            <li>• Each verification costs 1 credit from your account</li>
                            <li>• Maximum 1000 certificates per upload</li>
                            <li>• Ensure certificate numbers are accurate</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Results Section */
                <div className="p-4 sm:p-6">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Verification Results</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {filteredResults.length} of {results.length} results
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleViewResults}
                        className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  {summary && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-blue-600">Total</p>
                            <p className="text-lg sm:text-2xl font-bold text-blue-900">{summary.total}</p>
                          </div>
                          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-green-600">Verified</p>
                            <p className="text-lg sm:text-2xl font-bold text-green-900">{summary.verified}</p>
                          </div>
                          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-red-600">Failed</p>
                            <p className="text-lg sm:text-2xl font-bold text-red-900">{summary.failed}</p>
                          </div>
                          <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-purple-600">Success Rate</p>
                            <p className="text-lg sm:text-2xl font-bold text-purple-900">{summary.successRate}%</p>
                          </div>
                          <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search certificates..."
                          value={filters.search}
                          onChange={(e) => setFilters({...filters, search: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="failed">Failed</option>
                      </select>

                      <select
                        value={filters.certificateType}
                        onChange={(e) => setFilters({...filters, certificateType: e.target.value})}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Types</option>
                        <option value="IJMB">IJMB</option>
                        <option value="JUPEB">JUPEB</option>
                        <option value="NCE">NCE</option>
                        <option value="OND">OND</option>
                        <option value="HND">HND</option>
                        <option value="A-Level WAEC (GCE)">A-Level WAEC (GCE)</option>
                        <option value="Cambridge A-Level">Cambridge A-Level</option>
                        <option value="NABTEB A-Level">NABTEB A-Level</option>
                      </select>
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Certificate
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                              Type
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                              Year
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                              Student
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredResults.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                                {results.length === 0 ? 'No results to display' : 'No results match your filters'}
                              </td>
                            </tr>
                          ) : (
                            filteredResults.map((result, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 sm:px-6 py-4">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {result.certificateNumber}
                                    </div>
                                    <div className="text-xs text-gray-500 sm:hidden">
                                      {result.certificateType} • {result.yearOfGraduation}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {result.certificateType}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 hidden md:table-cell">
                                  {result.yearOfGraduation}
                                </td>
                                <td className="px-3 sm:px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    result.verified 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {result.verified ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <XCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {result.verified ? 'Verified' : 'Failed'}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 hidden lg:table-cell">
                                  {result.verified ? result.studentName || 'Found' : 'Not Found'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkVerification;