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

  const institutionNames = {
    'private-university': [
      'Covenant University',
      'Babcock University',
      'American University of Nigeria',
      'Bowen University',
      'Afe Babalola University',
      'Bells University of Technology',
      'Benson Idahosa University',
      'Caritas University',
      'Chrisland University',
      'Christopher University',
      'Crawford University',
      'Crescent University',
      'Edwin Clark University',
      'Elizade University',
      'Evangel University',
      'Fountain University',
      'Godfrey Okoye University',
      'Gregory University',
      'Hallmark University',
      'Hezekiah University',
      'Igbinedion University',
      'Joseph Ayo Babalola University',
      'Kings University',
      'Kola Daisi University',
      'Landmark University',
      'Lead City University',
      'Madonna University',
      'McPherson University',
      'Mountain Top University',
      'Nile University of Nigeria',
      'Novena University',
      'Obong University',
      'Oduduwa University',
      'Pan-Atlantic University',
      'Paul University',
      'Redeemer\'s University',
      'Rhema University',
      'Ritman University',
      'Salem University',
      'Samuel Adegboyega University',
      'Southwestern University',
      'Summit University',
      'Tansian University',
      'University of Mkar',
      'Veritas University',
      'Wesley University',
      'Western Delta University',
      'Achievers University',
      'Al-Hikmah University',
      'Anchor University',
      'Arthur Jarvis University',
      'Atiba University',
      'Augustine University',
      'Baze University',
      'Bingham University',
      'Caleb University',
      'Dominican University',
      'Eastern Palm University',
      'ECWA Bingham University',
      'Greenfield University',
      'Ibrahim Badamasi Babangida University',
      'Legacy University',
      'Micheal and Cecilia Ibru University',
      'Mudiame University',
      'Precious Cornerstone University',
      'Raymond Akano University of Technology',
      'Redeemer\'s University',
      'Renaissance University',
      'Sankore University',
      'Skyline University Nigeria',
      'Sule Lamido University',
      'The University of Funtua',
      'Topfaith University',
      'Trinity University',
      'University of Offa',
      'Wellspring University'
    ],
    'public-university': [
      'University of Ibadan',
      'University of Nigeria, Nsukka',
      'Obafemi Awolowo University',
      'University of Lagos',
      'Ahmadu Bello University',
      'University of Benin',
      'University of Calabar',
      'University of Ilorin',
      'University of Jos',
      'University of Maiduguri',
      'University of Port Harcourt',
      'University of Abuja',
      'Bayero University Kano',
      'Federal University of Technology, Akure',
      'Federal University of Technology, Minna',
      'Federal University of Technology, Owerri',
      'Federal University of Agriculture, Abeokuta',
      'Federal University of Petroleum Resources, Effurun',
      'Michael Okpara University of Agriculture, Umudike',
      'Modibbo Adama University of Technology',
      'Nigerian Defence Academy',
      'Nnamdi Azikiwe University',
      'Usmanu Danfodiyo University',
      'Abubakar Tafawa Balewa University',
      'Federal University, Dutse',
      'Federal University, Dutsin-Ma',
      'Federal University, Kashere',
      'Federal University, Lafia',
      'Federal University, Lokoja',
      'Federal University, Otuoke',
      'Federal University, Oye-Ekiti',
      'Federal University, Birnin Kebbi',
      'Federal University, Gusau',
      'Federal University, Wukari',
      'Alex Ekwueme Federal University, Ndufu-Alike',
      'Federal University of Health Sciences, Otukpo',
      'Federal University of Health Sciences, Azare',
      'Federal University of Transportation, Daura'
    ],
    'public-college-of-education': [
      'Adeyemi College of Education',
      'Alvan Ikoku Federal College of Education',
      'Federal College of Education (Technical), Akoka',
      'Federal College of Education (Technical), Gombe',
      'Federal College of Education (Technical), Omoku',
      'Federal College of Education (Technical), Umunze',
      'Federal College of Education, Abeokuta',
      'Federal College of Education, Eha-Amufu',
      'Federal College of Education, Kano',
      'Federal College of Education, Katsina',
      'Federal College of Education, Kontagora',
      'Federal College of Education, Obudu',
      'Federal College of Education, Okene',
      'Federal College of Education, Oyo',
      'Federal College of Education, Pankshin',
      'Federal College of Education, Yola',
      'Federal College of Education, Zaria',
      'Michael Otedola College of Primary Education',
      'Tai Solarin College of Education',
      'Adeniran Ogunsanya College of Education',
      'Kwara State College of Education',
      'Osun State College of Education',
      'Oyo State College of Education',
      'Ekiti State College of Education',
      'Delta State College of Education',
      'Enugu State College of Education',
      'Kogi State College of Education',
      'Niger State College of Education',
      'Ondo State College of Education',
      'Plateau State College of Education',
      'Rivers State College of Education'
    ],
    'private-college-of-education': [
      'St. Augustine College of Education',
      'Cornerstone College of Education',
      'FCT College of Education',
      'Heritage College of Education',
      'Jama\'atu College of Education',
      'Nigerian Army College of Education',
      'Rafiki College of Education',
      'Shehu Shagari College of Education',
      'Tansian University College of Education',
      'Temple Gate College of Education',
      'The College of Education, Nsukka',
      'Unity College of Education'
    ],
    'public-poly': [
      'Yaba College of Technology',
      'Federal Polytechnic, Ado-Ekiti',
      'Federal Polytechnic, Bida',
      'Federal Polytechnic, Damaturu',
      'Federal Polytechnic, Ede',
      'Federal Polytechnic, Idah',
      'Federal Polytechnic, Ilaro',
      'Federal Polytechnic, Kaura Namoda',
      'Federal Polytechnic, Mubi',
      'Federal Polytechnic, Nasarawa',
      'Federal Polytechnic, Nekede',
      'Federal Polytechnic, Offa',
      'Federal Polytechnic, Oko',
      'Federal Polytechnic, Ukana',
      'Akanu Ibiam Federal Polytechnic',
      'Kaduna Polytechnic',
      'Auchi Polytechnic',
      'Lagos State Polytechnic',
      'Rivers State Polytechnic',
      'Osun State Polytechnic',
      'Delta State Polytechnic',
      'Kano State Polytechnic',
      'Kwara State Polytechnic',
      'Ogun State Polytechnic',
      'Ondo State Polytechnic'
    ],
    'private-poly': [
      'Crown Polytechnic',
      'Dorben Polytechnic',
      'Hussaini Adamu Federal Polytechnic',
      'Interlink Polytechnic',
      'Nacabs Polytechnic',
      'Nuhu Bamalli Polytechnic',
      'Ramat Polytechnic',
      'Ronik Polytechnic',
      'Sure Foundation Polytechnic',
      'Temple Gate Polytechnic',
      'The Polytechnic, Ile-Ife',
      'Wolex Polytechnic'
    ],
    'exam-body': [
      'West African Examinations Council (WAEC)',
      'National Examinations Council (NECO)',
      'National Business and Technical Examinations Board (NABTEB)',
      'Joint Admissions and Matriculation Board (JAMB)',
      'Teachers Registration Council of Nigeria (TRCN)',
      'National Board for Technical Education (NBTE)',
      'National Commission for Colleges of Education (NCCE)',
      'National Universities Commission (NUC)',
      'Lagos State Examinations Board',
      'Rivers State Ministry of Education'
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
      'Professional Bodies',
      'Industrial Training Fund (ITF)',
      'National Youth Service Corps (NYSC)',
      'National Teachers Institute (NTI)',
      'National Institute for Educational Planning and Administration (NIEPA)',
      'National Institute for Nigerian Languages (NINLAN)',
      'Nigerian Educational Research and Development Council (NERDC)',
      'Universal Basic Education Commission (UBEC)',
      'National Library of Nigeria',
      'National Mathematical Center (NMC)'
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
        {/* Success message UI */}
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
            </div>

            {/* Institution Name Dropdown - Show when institutionType is selected */}
            {formData.institutionType && (
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

          {/* Institution Details - Show when institutionName is selected */}
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

          {/* Terms and Submit - Show when institutionName is selected */}
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