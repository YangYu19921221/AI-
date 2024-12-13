import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import Chat from './pages/ai/Chat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" />
      },
      // 教师路由
      {
        path: '/teacher',
        children: [
          {
            path: 'dashboard',
            element: <TeacherDashboard />
          },
          {
            path: 'students',
            element: <div>学生管理</div>
          },
          {
            path: 'courses',
            element: <div>课程管理</div>
          },
          {
            path: 'exercises',
            element: <div>题库管理</div>
          }
        ]
      },
      // 学生路由
      {
        path: '/student',
        children: [
          {
            path: 'dashboard',
            element: <StudentDashboard />
          },
          {
            path: 'courses',
            element: <StudentCourses />
          },
          {
            path: 'schedule',
            element: <div>学习计划</div>
          },
          {
            path: 'ai-chat',
            element: <Chat />
          }
        ]
      },
      // 通用路由
      {
        path: '/profile',
        element: <div>个人中心</div>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  }
]);

export default router;
