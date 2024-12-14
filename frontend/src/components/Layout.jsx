import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  BookOutlined, 
  FileTextOutlined, 
  MessageOutlined, 
  LogoutOutlined,
  UserOutlined 
} from '@ant-design/icons';
import './Layout.css';

const { Content, Sider } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

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

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>AI辅导系统</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/student/dashboard',
              icon: <DashboardOutlined />,
              label: '仪表盘',
            },
            {
              key: '/student/courses',
              icon: <BookOutlined />,
              label: '我的课程',
            },
            {
              key: '/student/assignments',
              icon: <FileTextOutlined />,
              label: '我的作业',
            },
            {
              key: '/ai/chat',
              icon: <MessageOutlined />,
              label: 'AI助手',
            },
            {
              key: '/student/profile',
              icon: <UserOutlined />,
              label: '个人中心',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: handleLogout
            }
          ]}
          onClick={({ key }) => {
            if (key !== 'logout') {
              navigate(key);
            }
          }}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <AntLayout style={{ marginLeft: 220, background: '#f5f5f5', minHeight: '100vh' }}>
        <Content style={{ padding: '32px 32px 24px 32px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
