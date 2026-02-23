import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetails from './pages/EmployeeDetails';
import PhotoResult from './pages/PhotoResult';
import Charts from './pages/Charts';
import EmployeeMap from './pages/Map';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/:id" 
            element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/photo-result" 
            element={
              <ProtectedRoute>
                <PhotoResult />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/charts" 
            element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <EmployeeMap />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
