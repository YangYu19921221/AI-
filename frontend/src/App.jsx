import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import Courses from './pages/student/Courses';
import CourseDetail from './pages/student/CourseDetail';
import Assignments from './pages/student/Assignments';
import Profile from './pages/student/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  // 检查用户是否已登录
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    return token !== null && userInfo !== null;
  };

  // 获取用户角色
  const getUserRole = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo).role : null;
  };

  // 保护路由的高阶组件
  const PrivateRoute = ({ children }) => {
    const auth = isAuthenticated();
    const role = getUserRole();
    const pathname = window.location.pathname;
    
    if (!auth) {
      // 保存当前路径用于登录后重定向
      localStorage.setItem('redirectPath', pathname);
      return <Navigate to="/login" />;
    }

    // 检查路由权限
    if (pathname.startsWith('/teacher/') && role !== 'teacher') {
      return <Navigate to="/student/dashboard" />;
    }
    if (pathname.startsWith('/student/') && role !== 'student') {
      return <Navigate to="/teacher/dashboard" />;
    }

    return children;
  };

  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* 根路径重定向 */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated()
                ? getUserRole() === 'teacher'
                  ? '/teacher/dashboard'
                  : '/student/dashboard'
                : '/login'
            }
          />
        }
      />

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
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetail />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </StudentLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
