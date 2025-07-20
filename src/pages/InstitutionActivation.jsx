import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, FileText, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const InstitutionActivation = () => {
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: '',
    subType: '',
    schoolEmail: '',
    deskOfficerPhone: '',
    address: '',
    accreditationId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const institutionTypes = [
    { value: 'private-university', label: 'Private University' },
    { value: 'public-university', label: 'Public University' },
    { value: 'public-college-of-education', label: 'Public College of Education' },
    { value: 'private-college-of-education', label: 'Private College of Education' },
    { value: 'public-poly', label: 'Public Polytechnic' },
    { value: 'private-poly', label: 'Private Polytechnic' },
    { value: 'exam-body', label: 'Exam Body' },
    { value: 'others', label: 'Others (Companies, Agencies, etc)' },
  ];


  // Sample institution names based on type and subtype
  const institutionNames = {
    'private-university': [
      'Covenant University',
      'Babcock University',
      'American University of Nigeria',
      'Bowen University',
      'Caleb University',
      'Crawford University',
      'Fountain University',
      'Igbinedion University',
      'Lead City University',
      'Madonna University',
      'Pan-Atlantic University',
      'Redeemer\'s University',
      'Wesley University'
    ],
    'public-university': [
        'University of Ibadan',
        'University of Nigeria, Nsukka',
        'Ahmadu Bello University',
        'University of Lagos',
        'Obafemi Awolowo University',
        'University of Benin',
        'University of Ilorin',
        'University of Jos',
        'University of Calabar',
        'University of Maiduguri',
        'University of Port Harcourt',
        'Bayero University Kano',
        'Federal University of Technology, Akure',
        'Federal University of Technology, Owerri',
        'Federal University of Technology, Minna',
        'Federal University of Agriculture, Abeokuta',
        'Federal University of Agriculture, Makurdi',
        'Federal University of Petroleum Resources, Effurun',
        'Nigerian Defence Academy',
        'University of Abuja'
    ],
    'public-college-of-education': [
        'Lagos State University',
        'Kaduna State University',
        'Kano State University of Science and Technology',
        'Rivers State University',
        'Delta State University',
        'Enugu State University of Science and Technology',
        'Imo State University',
        'Abia State University',
        'Anambra State University',
        'Ebonyi State University',
        'Cross River State University of Technology',
        'Akwa Ibom State University',
        'Bayelsa State University',
        'Edo State University',
        'Ekiti State University',
        'Ondo State University of Science and Technology',
        'Osun State University',
        'Oyo State Technical University',
        'Plateau State University',
        'Taraba State University',
        'Nasarawa State University',
        'Niger State University',
        'Kebbi State University of Science and Technology',
        'Sokoto State University',
        'Zamfara State University',
        'Yobe State University',
        'Gombe State University'
    ],
    'private-college-of-education': [
      'Adeniran Ogunsanya College of Education',
      'Tai Solarin College of Education',
      'Michael Otedola College of Primary Education',
      'St. Augustine College of Education',
      'Kwara State College of Education',
      'Federal College of Education, Abeokuta',
      'Federal College of Education, Akoka'
    ],
    'public-poly': [
      'Yaba College of Technology',
      'Federal Polytechnic, Nekede',
      'Kaduna Polytechnic',
      'Federal Polytechnic, Bida',
      'Moshood Abiola Polytechnic',
      'Lagos State Polytechnic',
      'Rivers State Polytechnic',
      'Auchi Polytechnic',
      'Federal Polytechnic, Ilaro',
      'Rufus Giwa Polytechnic'
    ],
    'private-poly': [
      'Crown Polytechnic',
      'Dorben Polytechnic',
      'Gateway Polytechnic',
      'Interlink Polytechnic',
      'Ronik Polytechnic',
      'Sure Foundation Polytechnic'
    ],
    'exam-body': [
      'West African Examinations Council (WAEC)',
      'National Examinations Council (NECO)',
      'National Business and Technical Examinations Board (NABTEB)',
      'Joint Admissions and Matriculation Board (JAMB)',
      'Teachers Registration Council of Nigeria (TRCN)',
      'National Board for Technical Education (NBTE)'
    ],
    'others': [
      'Nigerian Immigration Service',
      'Nigerian Police Force',
      'Nigerian Army',
      'Nigerian Navy',
      'Nigerian Air Force',
      'Federal Ministry of Education',
      'State Ministry of Education',
      'Corporate Training Centers',
      'Professional Bodies'
    ]
  };

  const getAvailableInstitutions = () => {
    return institutionNames[formData.institutionType] || [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields when parent changes
      ...(name === 'institutionType' ? { institutionName: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/activate-institution', formData);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Activation request failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Activation Request Submitted!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your institution activation request has been successfully submitted. Our admin team will review your application and send activation credentials to your provided email address within 2-3 business days.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Next Steps:</strong><br />
              1. Check your email for activation confirmation<br />
              2. Wait for admin approval (2-3 business days)<br />
              3. Receive login credentials via email<br />
              4. Start uploading student certificates
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Building className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Institution Activation Request
          </h1>
          <p className="text-gray-600">
            Complete this form to request activation for your educational institution
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Institution Classification */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Institution Classification
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Type *
                </label>
                <select
                  id="institutionType"
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select institution type</option>
                  {institutionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.institutionType === 'public' && (
                <div>
                  <label htmlFor="subType" className="block text-sm font-medium text-gray-700 mb-2">
                    Public Institution Type *
                  </label>
                  <select
                    id="subType"
                    name="subType"
                    value={formData.subType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    {publicSubTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Institution Name Dropdown */}
            {(formData.institutionType === 'private' || (formData.institutionType === 'public' && formData.subType)) && (
              <div className="mt-6">
                <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name *
                </label>
                <select
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your institution</option>
                  {getAvailableInstitutions().map(name => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Don't see your institution? Contact our admin team to add it to the system.
                </p>
              </div>
            )}
          </div>

          {/* Institution Details */}
          {formData.institutionName && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Institution Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="accreditationId" className="block text-sm font-medium text-gray-700 mb-2">
                    Accreditation/Registration ID *
                  </label>
                  <input
                    type="text"
                    id="accreditationId"
                    name="accreditationId"
                    value={formData.accreditationId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Official registration number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="deskOfficerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Desk Officer Phone *
                  </label>
                  <input
                    type="tel"
                    id="deskOfficerPhone"
                    name="deskOfficerPhone"
                    value={formData.deskOfficerPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+234 xxx xxx xxxx"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Official School Email *
                </label>
                <input
                  type="email"
                  id="schoolEmail"
                  name="schoolEmail"
                  value={formData.schoolEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@institutionname.edu.ng"
                  required
                />
              </div>

              <div className="mt-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Complete address including city and state"
                  required
                />
              </div>
            </div>
          )}

          {/* Terms and Submit */}
          {formData.institutionName && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm mb-4">
                  <strong>Important:</strong> By submitting this form, you confirm that:
                </p>
                <ul className="text-blue-700 text-sm space-y-1 ml-4">
                  <li>• All information provided is accurate and verifiable</li>
                  <li>• You are authorized to represent this institution</li>
                  <li>• You agree to maintain data security and privacy standards</li>
                  <li>• You will only upload authentic student certificate data</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
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
  );
};

export default InstitutionActivation;