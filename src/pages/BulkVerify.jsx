import React, { useState } from "react";
import Papa from "papaparse";
import { Upload, AlertTriangle, FileSpreadsheet, Loader2, CheckCircle, XCircle, Download } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

const BulkVerify = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (!result.meta.fields.includes("regNumber")) {
          alert("CSV must have a 'regNumber' column");
          return;
        }
        setRows(result.data.map((row, index) => ({ id: index + 1, regNumber: row.regNumber.trim() })));
        setResults(null);
      },
    });
  };

  const handleBulkVerification = async () => {
    setLoading(true);
    setShowConfirmModal(false);
    try {
      const response = await api.post("/verification/bulk-verify", {
        regNumbers: rows.map((r) => r.regNumber),
      });
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
      alert("Bulk verification failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FileSpreadsheet className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Certificate Verification</h1>
          <p className="text-gray-600">
            Upload a CSV file with a <code>regNumber</code> column. Each registration number will be verified.
          </p>
        </div>

        {/* File Upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 mb-8">
          <Upload className="h-10 w-10 text-gray-400 mb-3" />
          <label
            htmlFor="csvUpload"
            className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upload CSV
          </label>
          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2">Ensure your CSV contains a <b>regNumber</b> column.</p>
        </div>

        {/* Preview Table */}
        {rows.length > 0 && !results && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Preview ({rows.length} records)</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Registration Number</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-4 py-2">{row.id}</td>
                      <td className="px-4 py-2">{row.regNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify All"
              )}
            </button>
          </div>
        )}

        {/* Results Table */}
        {results && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Verification Results</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Reg Number</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Details</th>
                    <th className="px-4 py-2">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{res.regNumber}</td>
                      <td className="px-4 py-2">
                        {res.success ? (
                          <span className="flex items-center text-green-700">
                            <CheckCircle className="h-5 w-5 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center text-red-700">
                            <XCircle className="h-5 w-5 mr-1" /> Not Found
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {res.success ? (
                          <div>
                            <p className="font-medium">{res.data.fullName}</p>
                            <p className="text-gray-500 text-xs">{res.data.institution}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {res.success ? (
                          <a
                            href={res.data.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Download className="h-4 w-4 mr-1" /> PDF
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Bulk Verification</h2>
            <p className="text-gray-600 mb-6">
              This action will deduct <span className="font-semibold text-red-600">{rows.length} tokens</span>,  
              one for each certificate. Are you sure you want to proceed?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkVerification}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkVerify;
