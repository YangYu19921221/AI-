import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  UserOutlined,
  BookOutlined,
  MessageOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const { token } = theme.useToken();

  // 检查用户是否已登录
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) {
    // 保存当前路径，登录后可以重定向回来
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    // 从localStorage获取用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setUserRole(userInfo.role || 'student'); // 默认为学生角色
  }, []);

  const getMenuItems = () => {
    const commonItems = [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          navigate('/login');
        },
      },
    ];

    const studentItems = [
      {
        key: 'student-dashboard',
        icon: <DashboardOutlined />,
        label: '仪表盘',
        onClick: () => navigate('/student/dashboard'),
      },
      {
        key: 'student-courses',
        icon: <BookOutlined />,
        label: '我的课程',
        onClick: () => navigate('/student/courses'),
      },
      {
        key: 'student-assignments',
        icon: <FileTextOutlined />,
        label: '我的作业',
        onClick: () => navigate('/student/assignments'),
      },
      {
        key: 'student-ai-chat',
        icon: <MessageOutlined />,
        label: 'AI助手',
        onClick: () => navigate('/ai/chat'),
      },
    ];

    const teacherItems = [
      {
        key: 'teacher-dashboard',
        icon: <DashboardOutlined />,
        label: '仪表盘',
        onClick: () => navigate('/teacher/dashboard'),
      },
      {
        key: 'teacher-students',
        icon: <TeamOutlined />,
        label: '学生管理',
        onClick: () => navigate('/teacher/students'),
      },
      {
        key: 'teacher-courses',
        icon: <BookOutlined />,
        label: '课程管理',
        onClick: () => navigate('/teacher/courses'),
      },
    ];

    return userRole === 'teacher' ? [...teacherItems, ...commonItems] : [...studentItems, ...commonItems];
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: `1px solid ${token.colorBorder}`,
        }}
      >
        <div style={{ height: '64px', padding: '16px', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>AI辅导系统</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          style={{ borderRight: 'none' }}
        />
      </Sider>
      <AntLayout style={{ marginLeft: 200 }}>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
