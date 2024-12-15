import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Menu, message } from 'antd';
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

  // 检查认证状态
  const token = sessionStorage.getItem('token');
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (!token) {
      // 保存当前路径，登录后可以重定向回来
      sessionStorage.setItem('redirectPath', location.pathname);
      navigate('/login');
      return;
    }

    // 设置用户角色
    setUserRole(userInfo.role || 'student');
  }, [token, location.pathname, navigate, userInfo]);

  // 如果没有 token，重定向到登录页
  if (!token) {
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    navigate('/login');
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
          defaultSelectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
          items={[
            {
              key: `/${userRole}/dashboard`,
              icon: <DashboardOutlined />,
              label: '仪表盘',
              onClick: () => navigate(`/${userRole}/dashboard`)
            },
            {
              key: '/student/courses',
              icon: <BookOutlined />,
              label: '我的课程',
              onClick: () => navigate('/student/courses')
            },
            {
              key: '/student/assignments',
              icon: <FileTextOutlined />,
              label: '我的作业',
              onClick: () => navigate('/student/assignments')
            },
            {
              key: '/ai/chat',
              icon: <MessageOutlined />,
              label: 'AI助手',
              onClick: () => navigate('/ai/chat')
            },
            {
              key: '/student/profile',
              icon: <UserOutlined />,
              label: '个人中心',
              onClick: () => navigate('/student/profile')
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: handleLogout
            }
          ]}
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
