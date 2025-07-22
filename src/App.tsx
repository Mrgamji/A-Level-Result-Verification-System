import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Verify from './pages/Verify';
import InstitutionActivation from './pages/InstitutionActivation';
import Login from './pages/Login';
import Institutions from './pages/admin/Institutions';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import Logs from './pages/admin/Logs';
import Students from './pages/institution/Students';
import AddStudent from './pages/institution/AddStudent';
import InstitutionDashboard from './pages/institution/Dashboard';
import Credits from './pages/institution/Credits';
import AdminSettings from './pages/admin/Settings';
import InstitutionSettings from './pages/institution/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/verify" element={<Layout><Verify /></Layout>} />
          <Route path="/institution/activate" element={<Layout><InstitutionActivation /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/institutions"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <Institutions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <AdminStudents />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <Logs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Institution Routes */}
          <Route
            path="/institution/dashboard"
            element={
              <ProtectedRoute role="institution">
                <DashboardLayout>
                  <InstitutionDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/institution/students"
            element={
              <ProtectedRoute role="institution">
                <DashboardLayout>
                  <Students />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/institution/add-student"
            element={
              <ProtectedRoute role="institution">
                <DashboardLayout>
                  <AddStudent />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/institution/credits"
            element={
              <ProtectedRoute role="institution">
                <DashboardLayout>
                  <Credits />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/institution/settings"
            element={
              <ProtectedRoute role="institution">
                <DashboardLayout>
                  <InstitutionSettings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <AdminSettings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;