import React, { useEffect, useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import SideMenu from './SideMenu';
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
        <SideMenu />
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
