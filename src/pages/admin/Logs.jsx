import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft,
  ChevronsRight,
  Filter, 
  Calendar,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';
import api from '../../utils/api';



const DEFAULT_PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 5;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    institution: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/logs');
      setLogs(response.data);
      setSuccess('Logs loaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch logs');
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.certificateNumber?.toLowerCase().includes(searchTerm) ||
        log.ipAddress?.toLowerCase().includes(searchTerm) ||
        log.institution?.toLowerCase().includes(searchTerm)
      );
    }

    // Institution filter
    if (filters.institution) {
      filtered = filtered.filter(log => 
        log.institution?.toLowerCase() === filters.institution.toLowerCase()
      );
    }

    // Status filter
    if (filters.status) {
      const statusBool = filters.status === 'success';
      filtered = filtered.filter(log => log.success === statusBool);
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        if (startDate && endDate) {
          return logDate >= startDate && logDate <= endDate;
        } else if (startDate) {
          return logDate >= startDate;
        } else if (endDate) {
          return logDate <= endDate;
        }
        return true;
      });
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      institution: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setShowFilters(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      const response = await api.get('/admin/logs/export', {
        responseType: 'blob',
        params: filters
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `verification-logs-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to export logs');
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const institutionOptions = [...new Set(logs.map(log => log.institution))].filter(Boolean).sort();
  const realTotalPages = Math.ceil(filteredLogs.length / pageSize);
  const totalPages = Math.min(realTotalPages, 50); // Cap at 50 pages max
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all certificate verification attempts
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={exportToCSV}
            disabled={exporting || filteredLogs.length === 0}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download className={`h-4 w-4 mr-2 ${exporting ? 'animate-pulse' : ''}`} />
            Export
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              placeholder="Search certificates, IPs, or institutions"
              value={filters.search}
              onChange={handleFilterChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <select
                  name="institution"
                  value={filters.institution}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="">All Institutions</option>
                  {institutionOptions.map((institution, index) => (
                    <option key={index} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm lg:text-base">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Logs</p>
              <p className="text-xl lg:text-2xl font-semibold text-gray-900">{logs.length}</p>
            </div>
            <div className="p-2 lg:p-3 rounded-full bg-blue-50 text-blue-600">
              <Info className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Successful Verifications</p>
              <p className="text-xl lg:text-2xl font-semibold text-green-600">
                {logs.filter(log => log.success).length}
              </p>
            </div>
            <div className="p-2 lg:p-3 rounded-full bg-green-50 text-green-600">
              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Failed Verifications</p>
              <p className="text-xl lg:text-2xl font-semibold text-red-600">
                {logs.filter(log => !log.success).length}
              </p>
            </div>
            <div className="p-2 lg:p-3 rounded-full bg-red-50 text-red-600">
              <XCircle className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate
                </th>
                <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Institution
                </th>
                <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  IP Address
                </th>
                <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 lg:px-6 py-8 text-center text-gray-500">
                    {logs.length === 0 ? 'No logs available' : 'No logs match your filters'}
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10 bg-blue-50 rounded-md flex items-center justify-center text-blue-600">
                          <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                        </div>
                        <div className="ml-2 lg:ml-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900">{log.certificateNumber || 'N/A'}</div>
                          <div className="sm:hidden text-xs text-gray-500 truncate">{log.Institution?.name || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{log.Institution?.name || 'N/A'}</div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 hidden md:table-cell">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {log.ipAddress}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.success ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {log.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 hidden lg:table-cell text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="px-3 lg:px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs lg:text-sm text-gray-700">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs lg:text-sm border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {[5, 10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="text-xs lg:text-sm text-gray-700 text-center">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredLogs.length)} of{' '}
              {filteredLogs.length} entries
            </div>

            <div className="flex items-center gap-0.5 lg:gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-1.5 lg:p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="First page"
              >
                <ChevronsLeft className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 lg:p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>

              {getVisiblePages().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-md border flex items-center justify-center text-xs lg:text-sm ${
                    currentPage === page 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'hover:bg-gray-100 transition-colors'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 lg:p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
              
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 lg:p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Last page"
              >
                <ChevronsRight className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;