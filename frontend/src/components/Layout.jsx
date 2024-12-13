import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  BookOutlined,
  MessageOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const { token } = theme.useToken();

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

    const teacherItems = [
      {
        key: '/teacher/dashboard',
        icon: <DashboardOutlined />,
        label: '教师主页',
        onClick: () => navigate('/teacher/dashboard'),
      },
      {
        key: '/teacher/students',
        icon: <TeamOutlined />,
        label: '学生管理',
        onClick: () => navigate('/teacher/students'),
      },
      {
        key: '/teacher/courses',
        icon: <BookOutlined />,
        label: '课程管理',
        onClick: () => navigate('/teacher/courses'),
      },
      {
        key: '/teacher/exercises',
        icon: <QuestionCircleOutlined />,
        label: '题库管理',
        onClick: () => navigate('/teacher/exercises'),
      },
      {
        key: '/teacher/assignments',
        icon: <FileTextOutlined />,
        label: '作业管理',
        onClick: () => navigate('/teacher/assignments'),
      },
    ];

    const studentItems = [
      {
        key: '/student/dashboard',
        icon: <DashboardOutlined />,
        label: '学习主页',
        onClick: () => navigate('/student/dashboard'),
      },
      {
        key: '/student/courses',
        icon: <BookOutlined />,
        label: '我的课程',
        onClick: () => navigate('/student/courses'),
      },
      {
        key: '/student/schedule',
        icon: <ScheduleOutlined />,
        label: '学习计划',
        onClick: () => navigate('/student/schedule'),
      },
      {
        key: '/student/ai-chat',
        icon: <MessageOutlined />,
        label: 'AI辅导',
        onClick: () => navigate('/student/ai-chat'),
      },
      {
        key: '/student/assignments',
        icon: <EditOutlined />,
        label: '我的作业',
        onClick: () => navigate('/student/assignments'),
      },
    ];

    return [
      ...(userRole === 'teacher' ? teacherItems : []),
      ...(userRole === 'student' ? studentItems : []),
      ...commonItems,
    ];
  };

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const pathSegments = location.pathname.split('/');
    const baseRoute = '/' + pathSegments.slice(1, 3).join('/');
    return [baseRoute];
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          padding: '0 24px', 
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <h1 style={{ 
          margin: 0, 
          fontSize: '18px',
          color: token.colorText,
        }}>
          AI辅导系统 - {userRole === 'teacher' ? '教师端' : '学生端'}
        </h1>
      </Header>
      <AntLayout>
        <Sider
          width={200}
          style={{
            background: token.colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={getMenuItems()}
          />
        </Sider>
        <AntLayout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: token.colorBgContainer,
              borderRadius: token.borderRadius,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
