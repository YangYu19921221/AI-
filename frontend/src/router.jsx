import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import StudentAssignments from './pages/student/Assignments';
import AssignmentDetail from './pages/student/AssignmentDetail';
import Chat from './pages/ai/Chat';

// 退出登录处理函数
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  return <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  // 公共路由（不需要Layout）
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
  },
  {
    path: '/logout',
    element: handleLogout()
  },
  // 需要Layout的路由
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/student/dashboard" />
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
            element: <CourseList />
          },
          {
            path: 'courses/:id',
            element: <CourseDetail />
          },
          {
            path: 'assignments',
            element: <StudentAssignments />
          },
          {
            path: 'assignments/:id',
            element: <AssignmentDetail />
          },
          {
            path: 'profile',
            element: <div>个人中心</div>
          }
        ]
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
          }
        ]
      },
      {
        path: '/ai/chat',
        element: <Chat />
      }
    ]
  }
]);

export default router;
