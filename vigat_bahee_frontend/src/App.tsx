import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import './App.css';
import VigatBahee from './components/VigatBahee';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route 
              path="/bahee" 
              element={
                <ProtectedRoute>
                  <VigatBahee />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route 
              path="/" 
              element={<Navigate to="/bahee" replace />}
            />
            
            {/* Catch all - redirect to login */}
            <Route 
              path="*" 
              element={<Navigate to="/login" replace />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
