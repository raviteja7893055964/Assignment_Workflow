import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/api/auth/login" replace />} />
      <Route path="/api/auth/login" element={<LoginPage />} />
      <Route path="/api/assignments" element={
        <ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard/></ProtectedRoute>
      } />
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}><StudentDashboard/></ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
