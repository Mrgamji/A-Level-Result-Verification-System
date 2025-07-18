import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
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
                  <Institutions />
                  </ProtectedRoute>
              }
            />
              <Route
              path="/admin/students"
              element={
                <ProtectedRoute role="admin">
                  <AdminStudents />
                  </ProtectedRoute>
              }
            />
             <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                  </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute role="admin">
                  <Logs />
                </ProtectedRoute>
              }
            />
            
            {/* Institution Routes */}
            <Route
              path="/institution/students"
              element={
                <ProtectedRoute role="institution">
                  <Students />
                </ProtectedRoute>
              }
            />
             <Route
              path="/institution/dashboard"
              element={
                <ProtectedRoute role="institution">
                  <InstitutionDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/add-student"
              element={
                <ProtectedRoute role="institution">
                  <AddStudent />
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