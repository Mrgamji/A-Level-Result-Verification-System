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
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href="/uploads/sample_upload.csv"
            download
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
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
              className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 cursor-pointer flex items-center ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload CSV'}
            </label>
          </div>
          <Link
            to="/institution/add-student"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name or certificate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        >
          <option value="">All Graduation Years</option>
          {graduationYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Certificate #</th>
              <th className="text-left px-4 py-2">Department</th>
              <th className="text-left px-4 py-2">Year</th>
              <th className="text-left px-4 py-2">Class</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="px-4 py-2">{student.fullName}</td>
                <td className="px-4 py-2">{student.certificateNumber}</td>
                <td className="px-4 py-2">{student.department}</td>
                <td className="px-4 py-2">
                  {student.yearOfEntry} - {student.yearOfGraduation}
                </td>
                <td className="px-4 py-2">{student.classOfDegree}</td>
                <td className="px-4 py-2 space-x-2">
                <button
  onClick={() => {
    setSelectedStudent(student);
    setShowEditModal(true);
  }}
  className="text-blue-600 text-xs"
>
  Edit
</button>
<button
  onClick={() => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  }}
  className="text-red-600 text-xs"
>
  Delete
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
{/* Edit Modal */}
{showEditModal && selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await api.put(`/students/${selectedStudent.id}`, selectedStudent);
            fetchStudents();
            setShowEditModal(false);
          } catch {
            alert("Failed to update student");
          }
        }}
        className="space-y-4"
      >
        {['fullName', 'certificateNumber', 'certificateType', 'department', 'yearOfEntry', 'yearOfGraduation', 'classOfDegree'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize mb-1">{field}</label>
            {field === 'certificateType' ? (
              <select
                value={selectedStudent[field]}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, [field]: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select certificate type</option>
                {[
                  'IJMB', 'JUPEB', 'NCE', 'OND', 'HND', 'PGD', 'PGDE',
                  'A-Level WAEC (GCE)', 'Cambridge A-Level', 'NABTEB A-Level',
                  'NBTE (Pre-ND)', 'Other Nigerian A-Level Results'
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedStudent[field]}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, [field]: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium capitalize mb-1">classOfDegree</label>
          <select
            value={selectedStudent.classOfDegree}
            onChange={(e) => setSelectedStudent({ ...selectedStudent, classOfDegree: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select class of degree</option>
            <option value="First Class">First Class</option>
            <option value="Second Class Upper">Second Class Upper</option>
            <option value="Second Class Lower">Second Class Lower</option>
            <option value="Third Class">Third Class</option>
            <option value="Pass">Pass</option>
            <option value="Distinction">Distinction</option>
            <option value="Upper Credit">Upper Credit</option>
            <option value="Lower Credit">Lower Credit</option>
            <option value="Merit">Merit</option>
            <option value="Credit">Credit</option>
          </select>
        </div>
              type="text"
              value={selectedStudent[field]}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, [field]: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Delete Confirmation Modal */}
{showDeleteModal && studentToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-3">Confirm Deletion</h3>
      <p>Are you sure you want to delete <strong>{studentToDelete.fullName}</strong>?</p>
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              await api.delete(`/students/${studentToDelete.id}`);
              fetchStudents();
              setShowDeleteModal(false);
            } catch {
              alert("Failed to delete student");
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 border-t">
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <div className="space-x-2">
            <button
              onClick={() => changePage('prev')}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => changePage('next')}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
