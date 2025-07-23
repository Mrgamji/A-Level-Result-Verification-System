import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, FileText, CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import api from '../utils/api';

const InstitutionActivation = () => {
  const [formData, setFormData] = useState({
    institutionType: '',
    institutionName: '',
    schoolEmail: '',
    deskOfficerPhone: '',
    address: '',
    accreditationId: '',
    deskOfficerName: '',
    deskOfficerPosition: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Institution type options
  const institutionTypes = [
    { value: 'private-university', label: 'Private University' },
    { value: 'public-university', label: 'Public University' },
    { value: 'college-of-education', label: 'College of Education' },
    { value: 'polytechnic', label: 'Polytechnic' },
    { value: 'exam-body', label: 'Exam Body' },
    { value: 'government-agency', label: 'Government Agency' },
    { value: 'other', label: 'Other Institution' },
  ];

  // Sample institution names based on type
  const institutionNames = {
    'private-university': [
      'Covenant University', 'Babcock University', 'American University of Nigeria',
      'Bowen University', 'Caleb University', 'Landmark University'
    ],
    'public-university': [
      'University of Lagos', 'University of Ibadan', 'Obafemi Awolowo University',
      'University of Nigeria, Nsukka', 'Ahmadu Bello University', 'University of Benin'
    ],
    'college-of-education': [
      'Federal College of Education (Technical), Akoka',
      'Adeniran Ogunsanya College of Education',
      'Tai Solarin College of Education',
      'Federal College of Education, Zaria'
    ],
    'polytechnic': [
      'Yaba College of Technology',
      'Federal Polytechnic, Nekede',
      'Lagos State Polytechnic',
      'Auchi Polytechnic'
    ],
    'exam-body': [
      'West African Examinations Council (WAEC)',
      'National Examinations Council (NECO)',
      'Joint Admissions and Matriculation Board (JAMB)'
    ],
    'government-agency': [
      'Federal Ministry of Education',
      'Nigerian Immigration Service',
      'National Youth Service Corps (NYSC)'
    ],
    'other': ['Other (Specify in address field)']
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate phone number (basic Nigerian format)
  const validatePhone = (phone) => {
    const re = /^(\+234|0)[789][01]\d{8}$/;
    return re.test(phone.replace(/\s+/g, ''));
  };

  // Handle field validation
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'institutionType':
        if (!value) error = 'Institution type is required';
        break;
      case 'institutionName':
        if (!value) error = 'Institution name is required';
        break;
      case 'schoolEmail':
        if (!value) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address'; }
        // } else if (!value.endsWith('.edu.ng') && !value.endsWith('.gov.ng')) {
        //   error = 'Please use an official .edu.ng or .gov.ng email';
        // }
        break;
      case 'deskOfficerPhone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!validatePhone(value)) {
          error = 'Please enter a valid Nigerian phone number';
        }
        break;
      case 'accreditationId':
        if (!value) error = 'Accreditation ID is required';
        break;
      case 'address':
        if (!value) error = 'Address is required';
        else if (value.length < 10) error = 'Address is too short';
        break;
      case 'deskOfficerName':
        if (!value) error = 'Officer name is required';
        break;
      case 'deskOfficerPosition':
        if (!value) error = 'Officer position is required';
        break;
      default:
        break;
    }
    
    return error;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await api.post('/auth/activate-institution', formData);
        setSuccess(true);
      } catch (error) {
        setErrors({
          ...errors,
          form: error.response?.data?.error || 'Activation request failed. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    }
    
    setIsSubmitting(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset institution name when type changes
      ...(name === 'institutionType' ? { institutionName: '' } : {})
    }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  // Handle blur events (mark fields as touched)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Green blurred gradient background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-300 via-emerald-200 to-green-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-emerald-200 via-green-100 to-green-50 rounded-full blur-2xl opacity-50"></div>
        </div>
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-10">
          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 p-6 text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-full mb-4 backdrop-blur-sm">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
            <p className="text-green-100">Your institution activation is being processed</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 text-gray-600">
              <p>We've received your institution activation request. Our team will review your application and contact you within 2 business days.</p>
              
              <div className="bg-green-50/80 border-l-4 border-green-500 p-4 backdrop-blur-sm rounded">
                <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 bg-green-100 rounded-full mr-2 text-green-600">1</span>
                    Verification of your institution details
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 bg-green-100 rounded-full mr-2 text-green-600">2</span>
                    Approval by our admin team
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 bg-green-100 rounded-full mr-2 text-green-600">3</span>
                    Account credentials sent to your email
                  </li>
                </ul>
              </div>
              
              <p className="text-sm">You'll receive a confirmation email shortly. If you don't see it, please check your spam folder.</p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-lg backdrop-blur-sm"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Green blurred gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-300 via-emerald-200 to-green-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-emerald-200 via-green-100 to-green-50 rounded-full blur-2xl opacity-50"></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Institution Activation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Register your institution to start verifying certificates on our platform
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
          {/* Form header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 p-6 sm:p-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white/30 p-3 rounded-lg backdrop-blur-sm">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-white">Institution Details</h2>
                <p className="text-green-100 text-sm mt-1">
                  Complete all fields to request activation
                </p>
              </div>
            </div>
          </div>
          
          {/* Form content */}
          <div className="p-6 sm:p-8">
            {errors.form && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Institution Type */}
              <div>
                <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="institutionType"
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-4 pr-10 py-3 text-base border ${errors.institutionType ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg shadow-sm focus:outline-none`}
                    required
                  >
                    <option value="">Select institution type</option>
                    {institutionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.institutionType && (
                  <p className="mt-2 text-sm text-red-600">{errors.institutionType}</p>
                )}
              </div>
              
              {/* Institution Name (conditional) */}
              {formData.institutionType && (
                <div>
                  <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="institutionName"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-4 pr-10 py-3 text-base border ${errors.institutionName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg shadow-sm focus:outline-none`}
                      required
                    >
                      <option value="">Select your institution</option>
                      {institutionNames[formData.institutionType]?.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.institutionName && (
                    <p className="mt-2 text-sm text-red-600">{errors.institutionName}</p>
                  )}
                  {formData.institutionName === 'Other (Specify in address field)' && (
                    <p className="mt-2 text-sm text-gray-500">
                      Please specify your institution name in the address field below
                    </p>
                  )}
                </div>
              )}
              
              {/* Institution Details (conditional) */}
              {formData.institutionName && (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Accreditation ID */}
                    <div>
                      <label htmlFor="accreditationId" className="block text-sm font-medium text-gray-700 mb-2">
                        Accreditation/Registration ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="accreditationId"
                        name="accreditationId"
                        value={formData.accreditationId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full px-4 py-3 border ${errors.accreditationId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg shadow-sm focus:outline-none`}
                        placeholder="e.g. EDU/12345/2023"
                        required
                      />
                      {errors.accreditationId && (
                        <p className="mt-2 text-sm text-red-600">{errors.accreditationId}</p>
                      )}
                    </div>
                    
                    {/* School Email */}
                    <div>
                      <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Official Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="schoolEmail"
                          name="schoolEmail"
                          value={formData.schoolEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`block w-full pl-10 pr-4 py-3 border ${errors.schoolEmail ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg focus:outline-none`}
                          placeholder="admin@institution.edu.ng"
                          required
                        />
                      </div>
                      {errors.schoolEmail && (
                        <p className="mt-2 text-sm text-red-600">{errors.schoolEmail}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Desk Officer Name */}
                    <div>
                      <label htmlFor="deskOfficerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="deskOfficerName"
                        name="deskOfficerName"
                        value={formData.deskOfficerName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full px-4 py-3 border ${errors.deskOfficerName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg shadow-sm focus:outline-none`}
                        placeholder="Full name"
                        required
                      />
                      {errors.deskOfficerName && (
                        <p className="mt-2 text-sm text-red-600">{errors.deskOfficerName}</p>
                      )}
                    </div>
                    
                    {/* Desk Officer Position */}
                    <div>
                      <label htmlFor="deskOfficerPosition" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="deskOfficerPosition"
                        name="deskOfficerPosition"
                        value={formData.deskOfficerPosition}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full px-4 py-3 border ${errors.deskOfficerPosition ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg shadow-sm focus:outline-none`}
                        placeholder="e.g. Registrar, Admin Officer"
                        required
                      />
                      {errors.deskOfficerPosition && (
                        <p className="mt-2 text-sm text-red-600">{errors.deskOfficerPosition}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Desk Officer Phone */}
                    <div>
                      <label htmlFor="deskOfficerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="deskOfficerPhone"
                          name="deskOfficerPhone"
                          value={formData.deskOfficerPhone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`block w-full pl-10 pr-4 py-3 border ${errors.deskOfficerPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg focus:outline-none`}
                          placeholder="e.g. 08012345678 or +2348012345678"
                          required
                        />
                      </div>
                      {errors.deskOfficerPhone && (
                        <p className="mt-2 text-sm text-red-600">{errors.deskOfficerPhone}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Institution Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        rows="4"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full pl-10 pr-4 py-3 border ${errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-lg focus:outline-none`}
                        placeholder="Full physical address including city and state"
                        required
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="terms" className="text-sm text-gray-700">
                          I certify that all information provided is accurate and I am authorized to represent this institution.
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          By submitting this form, you agree to our Terms of Service and Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg backdrop-blur-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Submit Activation Request'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
        
        {/* Help section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@certverify.ng" className="text-green-600 hover:text-green-800">
              support@certverify.ng
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstitutionActivation;