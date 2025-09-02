import React, { useState, useEffect } from "react";
import api from '../../utils/api';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  RefreshCw
} from 'lucide-react';

const DEFAULT_PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 5;
const MAX_PAGES = 1000;

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filters, setFilters] = useState({
    institution: "",
    date: "",
    graduationYear: "",
    search: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/students");
      setStudents(res.data);
      setSuccess("Students loaded successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to load students");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...students];

    if (filters.institution) {
      filtered = filtered.filter(s =>
        s.institution?.toLowerCase().includes(filters.institution.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter(s => s.uploadDate === filters.date);
    }

    if (filters.graduationYear) {
      filtered = filtered.filter(s => s.yearOfGraduation?.toString() === filters.graduationYear);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.fullName?.toLowerCase().includes(term) ||
          s.classOfDegree?.toLowerCase().includes(term) ||
          s.institution?.toLowerCase().includes(term) ||
          s.certificateNumber?.toLowerCase().includes(term)
      );
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [students, filters]);

  // Calculate pagination
  const realTotalPages = Math.ceil(filteredStudents.length / pageSize);
  const totalPages = Math.min(realTotalPages, MAX_PAGES);

  // Get paginated data
  const paginatedStudents = filteredStudents
    .slice(0, MAX_PAGES * pageSize)
    .slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  // Get unique filter options
  const institutionOptions = [...new Set(students.map(s => s.institution))].filter(Boolean).sort();
  const dateOptions = [...new Set(students.map(s => s.uploadDate))].filter(Boolean).sort();
  const graduationYearOptions = [...new Set(students.map(s => s.yearOfGraduation))].filter(Boolean).sort((a, b) => b - a);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      institution: "",
      date: "",
      graduationYear: "",
      search: ""
    });
  };

  // Pagination controls
  const getVisiblePages = () => {
    const totalVisiblePages = Math.min(totalPages, MAX_VISIBLE_PAGES);
    let startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2));
    startPage = Math.min(startPage, totalPages - totalVisiblePages + 1);

    return Array.from({ length: totalVisiblePages }, (_, i) => startPage + i);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-2 py-4 lg:py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-blue-900 tracking-tight">Students Management</h2>
            <p className="text-sm text-gray-500 mt-1">View and manage all students across institutions</p>
          </div>
          <button
            onClick={fetchStudents}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-colors text-sm w-full sm:w-auto justify-center font-semibold"
          >
            <RefreshCw size={18} className="animate-spin" />
            Refresh Data
          </button>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-2 font-medium shadow-sm">
            <RefreshCw className="animate-spin" size={18} />
            Loading students...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg flex items-center gap-2 font-medium shadow-sm">
            <span className="text-red-500">✕</span>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-2 font-medium shadow-sm">
            <span className="text-green-500">✓</span>
            {success}
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xs lg:text-sm font-semibold text-gray-700 mb-3 tracking-wide">FILTER STUDENTS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder="Name, email, institution, or certificate #"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1">Institution</label>
              <select
                name="institution"
                value={filters.institution}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">All Institutions</option>
                {institutionOptions.map(inst => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1">Upload Date</label>
              <select
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">All Dates</option>
                {dateOptions.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1">Graduation Year</label>
              <select
                name="graduationYear"
                value={filters.graduationYear}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">All Years</option>
                {graduationYearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md transition duration-150 flex items-center justify-center gap-2 text-sm shadow"
              >
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs lg:text-sm gap-2">
            <div className="text-gray-600 font-medium">
              Showing {filteredStudents.length} of {students.length} students
            </div>
            {filteredStudents.length !== students.length && (
              <div className="text-blue-600 font-medium">
                {students.length - filteredStudents.length} filtered out
              </div>
            )}
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
              <tr>
                <th scope="col" className="px-3 lg:px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-3 lg:px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-3 lg:px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Certificate #
                </th>
                <th scope="col" className="px-3 lg:px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider hidden sm:table-cell">
                  Graduation
                </th>
                <th scope="col" className="px-3 lg:px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider hidden md:table-cell">
                  Institution
                </th>
                <th scope="col" className="px-3 lg:px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider hidden lg:table-cell">
                  Uploaded
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 lg:px-5 py-8 text-center text-gray-400 font-medium">
                    {students.length === 0 ? 'No students available' : 'No students match your filters'}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-3 lg:px-5 py-4 text-gray-500 font-semibold">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-3 lg:px-5 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 lg:h-11 lg:w-11 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-base shadow-sm border border-blue-200">
                          {student.fullName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="ml-3 lg:ml-5 min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 truncate">{student.fullName || 'Unknown'}</div>
                          <div className="text-xs text-gray-500 truncate">{student.classOfDegree || 'No email'}</div>
                          <div className="sm:hidden text-xs text-gray-400 mt-1">
                            {student.yearOfGraduation || 'N/A'} • {student.institution || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-5 py-4">
                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100 shadow-sm">
                        {student.certificateNumber || <span className="text-gray-400">N/A</span>}
                      </span>
                    </td>
                    <td className="px-3 lg:px-5 py-4 hidden sm:table-cell">
                      <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100 shadow-sm">
                        {student.yearOfGraduation || 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 lg:px-5 py-4 hidden md:table-cell text-gray-600 font-medium">
                      {student.institution || <span className="text-gray-400">Unknown</span>}
                    </td>
                    <td className="px-3 lg:px-5 py-4 hidden lg:table-cell text-gray-500 font-medium">
                      {student.uploadDate ? new Date(student.uploadDate).toLocaleDateString() : <span className="text-gray-400">N/A</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs lg:text-sm text-gray-700 font-semibold">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs lg:text-sm border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                {[5, 10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="text-xs lg:text-sm text-gray-700 text-center font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredStudents.length)} of{' '}
              {filteredStudents.length} entries
              {realTotalPages > MAX_PAGES && (
                <span className="ml-2 text-xs text-gray-500">(first {MAX_PAGES * pageSize} shown)</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-colors bg-white"
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-colors bg-white"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getVisiblePages().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 lg:w-11 lg:h-11 rounded-md border flex items-center justify-center text-xs lg:text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : 'bg-white text-blue-700 border-gray-200 hover:bg-blue-50'
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-colors bg-white"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-colors bg-white"
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;