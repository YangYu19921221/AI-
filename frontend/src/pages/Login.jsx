import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

// 配置 axios 默认值
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3001';

const Login = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await axios.post('/api/users/login', values);
            
            if (response.data.success) {
                const { token, user } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userInfo', JSON.stringify(user));
                
                message.success('登录成功！');
                
                // 根据用户角色导航到不同的仪表盘
                const dashboardPath = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
                navigate(dashboardPath);
            } else {
                message.error(response.data.message || '登录失败');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                message.error('用户名或密码错误');
            } else {
                message.error('登录失败：' + (error.response?.data?.message || '服务器错误'));
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="decoration-circle decoration-circle-1" />
            <div className="decoration-circle decoration-circle-2" />
            
            <div className="auth-card">
                <h1 className="auth-title">
                    AI LEARNING
                    <span className="auth-subtitle">智能学习助手</span>
                </h1>

                <Form
                    name="login"
                    className="auth-form"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名',
                            },
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="用户名" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button" size="large">
                            登录
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <Link to="/register">注册账号</Link>
                        <Link to="/forgot-password">忘记密码？</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
