import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './styles.css';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const menuItems = [
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
      key: '/profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
      className: 'logout-item'
    }
  ];

  return (
    <div className="side-menu">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 className="app-title">AI辅导系统</h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key, onClick }) => {
          if (onClick) {
            onClick();
          } else {
            navigate(key);
          }
        }}
        className="custom-menu"
      />
      <div className="user-info">
        <img src={userInfo.avatar || '/default-avatar.png'} alt="Avatar" className="user-avatar" />
        <span className="user-name">{userInfo.name || '同学'}</span>
      </div>
    </div>
  );
};

export default SideMenu;
