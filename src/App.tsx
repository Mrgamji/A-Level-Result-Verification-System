import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/institution/activate" element={<InstitutionActivation />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
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
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;