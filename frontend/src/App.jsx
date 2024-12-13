import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import TeacherDashboard from './pages/teacher/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  // 检查用户是否已登录
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // 获取用户角色
  const getUserRole = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  };

  // 保护路由的高阶组件
  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 教师路由 */}
      <Route
        path="/teacher/*"
        element={
          <PrivateRoute>
            <TeacherLayout>
              <Routes>
                <Route path="dashboard" element={<TeacherDashboard />} />
                {/* 其他教师页面路由将在这里添加 */}
              </Routes>
            </TeacherLayout>
          </PrivateRoute>
        }
      />

      {/* 学生路由 */}
      <Route
        path="/student/*"
        element={
          <PrivateRoute>
            <StudentLayout>
              <Routes>
                {/* 学生页面路由将在这里添加 */}
              </Routes>
            </StudentLayout>
          </PrivateRoute>
        }
      />

      {/* 根路由重定向 */}
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to={getUserRole() === 'teacher' ? "/teacher/dashboard" : "/student/dashboard"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
