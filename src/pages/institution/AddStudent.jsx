import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../../utils/api';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    certificateNumber: '',
    yearOfEntry: '',
    yearOfGraduation: '',
    classOfDegree: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/students', formData);
      navigate('/institution/students');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Number
              </label>
              <input
                type="text"
                id="certificateNumber"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="classOfDegree" className="block text-sm font-medium text-gray-700 mb-1">
                Class of Degree
              </label>
              <select
                id="classOfDegree"
                name="classOfDegree"
                value={formData.classOfDegree}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select class of degree</option>
                <option value="First Class">First Class</option>
                <option value="Second Class Upper">Second Class Upper</option>
                <option value="Second Class Lower">Second Class Lower</option>
                <option value="Third Class">Third Class</option>
                <option value="Pass">Pass</option>
              </select>
            </div>

            <div>
              <label htmlFor="yearOfEntry" className="block text-sm font-medium text-gray-700 mb-1">
                Year of Entry
              </label>
              <input
                type="number"
                id="yearOfEntry"
                name="yearOfEntry"
                value={formData.yearOfEntry}
                onChange={handleChange}
                min="1950"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="yearOfGraduation" className="block text-sm font-medium text-gray-700 mb-1">
                Year of Graduation
              </label>
              <input
                type="number"
                id="yearOfGraduation"
                name="yearOfGraduation"
                value={formData.yearOfGraduation}
                onChange={handleChange}
                min="1950"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/institution/students')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;