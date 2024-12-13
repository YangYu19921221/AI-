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

  const menuItems = [
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: '我的课程',
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: '学习计划',
    },
    {
      key: 'ai-tutor',
      icon: <RobotOutlined />,
      label: 'AI辅导',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.split('/')[2] || 'courses']}
          items={menuItems}
          onClick={({ key }) => navigate(`/student/${key}`)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
