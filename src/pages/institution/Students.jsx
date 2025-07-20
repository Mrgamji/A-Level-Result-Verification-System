import React, { useState, useEffect } from 'react';
import { Users, Upload, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

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

  const classOfDegreeOptions = [
    'First Class',
    'Second Class Upper',
    'Second Class Lower',
    'Third Class',
    'Pass',
    'Distinction',
    'Upper Credit',
    'Lower Credit',
    'Merit',
    'Credit'
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await api.post('/students/upload-csv', formData);
      alert(response.data.message);
      fetchStudents();
    } catch (error) {
      alert(
        error?.response?.data?.error ||
        error?.response?.data?.errors?.[0] ||
        'Failed to upload CSV file'
      );
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${selectedStudent.id}`, selectedStudent);
      fetchStudents();
      setShowEditModal(false);
      setSelectedStudent(null);
    } catch (error) {
      alert("Failed to update student");
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await api.delete(`/students/${studentToDelete.id}`);
      fetchStudents();
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      alert("Failed to delete student");
    }
  };

  const getCertificateTypeColor = (type) => {
    const colors = {
      'IJMB': 'bg-blue-600',
      'JUPEB': 'bg-green-600',
      'NCE': 'bg-purple-600',
      'OND': 'bg-orange-600',
      'HND': 'bg-red-600',
      'PGD': 'bg-indigo-600',
      'PGDE': 'bg-pink-600',
      'A-Level WAEC (GCE)': 'bg-teal-600',
      'Cambridge A-Level': 'bg-cyan-600',
      'NABTEB A-Level': 'bg-emerald-600',
      'NBTE (Pre-ND)': 'bg-amber-600',
      'Other Nigerian A-Level Results': 'bg-gray-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  // Filtered and paginated data
  const departments = [...new Set(students.map(s => s.department))];
  const graduationYears = [...new Set(students.map(s => s.yearOfGraduation))].sort();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept ? student.department === filterDept : true;
    const matchesYear = filterYear ? student.yearOfGraduation.toString() === filterYear : true;
    return matchesSearch && matchesDept && matchesYear;
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const changePage = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href="/uploads/sample_upload.csv"
            download
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Download CSV Template
          </a>
          <div>
            <input
              type="file"
              id="csv-upload"
              onChange={handleFileUpload}
              className="hidden"
              accept=".csv"
              disabled={uploading}
            />
            <label
              htmlFor="csv-upload"
              className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload CSV'}
            </label>
          </div>
          <Link
            to="/institution/add-student"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search name or certificate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Graduation Years</option>
            {graduationYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {students.length === 0 ? 'No students available' : 'No students match your filters'}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                        <div className="text-sm text-gray-500">{student.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.certificateNumber}</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getCertificateTypeColor(student.certificateType)}`}>
                            {student.certificateType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>{student.yearOfEntry} - {student.yearOfGraduation}</div>
                        <div className="text-gray-500">{student.classOfDegree}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStudent({ ...student });
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDelete(student);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => changePage('prev')}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => changePage('next')}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Student</h2>
              <form onSubmit={handleEditStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={selectedStudent.fullName}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, fullName: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Number</label>
                    <input
                      type="text"
                      value={selectedStudent.certificateNumber}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, certificateNumber: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
                    <select
                      value={selectedStudent.certificateType}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, certificateType: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select certificate type</option>
                      {certificateTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={selectedStudent.department}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, department: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Entry</label>
                    <input
                      type="number"
                      value={selectedStudent.yearOfEntry}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, yearOfEntry: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1950"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Graduation</label>
                    <input
                      type="number"
                      value={selectedStudent.yearOfGraduation}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, yearOfGraduation: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1950"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class of Degree</label>
                  <select
                    value={selectedStudent.classOfDegree}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, classOfDegree: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select class of degree</option>
                    {classOfDegreeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{studentToDelete.fullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setStudentToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;