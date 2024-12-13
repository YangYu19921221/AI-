import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    BookOutlined,
    RobotOutlined,
    TeamOutlined,
    LogoutOutlined,
    HomeOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        message.success('已退出登录');
    };

    const menuItems = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: '主页',
        },
        {
            key: '2',
            icon: <BookOutlined />,
            label: '课程管理',
        },
        {
            key: '3',
            icon: <FileTextOutlined />,
            label: '作业管理',
        },
        {
            key: '4',
            icon: <RobotOutlined />,
            label: 'AI助手',
        },
        {
            key: '5',
            icon: <TeamOutlined />,
            label: '在线答疑',
        }
    ];

    if (!user) return null;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ 
                background: '#fff', 
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ margin: 0 }}>AI辅导系统</h1>
                <Button 
                    onClick={handleLogout}
                    icon={<LogoutOutlined />}
                >
                    退出登录
                </Button>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                    />
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: '#fff'
                        }}
                    >
                        <div>欢迎使用AI辅导系统</div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
