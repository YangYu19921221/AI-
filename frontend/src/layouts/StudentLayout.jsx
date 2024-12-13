import React from 'react';
import { Layout, Menu } from 'antd';
import {
  BookOutlined,
  CalendarOutlined,
  RobotOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 处理菜单点击
  const handleMenuClick = (key) => {
    navigate(`/student/${key}`);
  };

  const menuItems = [
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: '我的课程',
      onClick: () => handleMenuClick('courses'),
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: '学习计划',
      onClick: () => handleMenuClick('schedule'),
    },
    {
      key: 'ai-tutor',
      icon: <RobotOutlined />,
      label: 'AI辅导',
      onClick: () => handleMenuClick('ai-tutor'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => handleMenuClick('profile'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo" style={{ 
          height: 32, 
          margin: 16, 
          background: '#1890ff',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          AI LEARNING
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.split('/')[2] || 'courses']}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
