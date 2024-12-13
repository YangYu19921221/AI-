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
            const response = await axios.post('/api/users/login', values, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                message.success('登录成功！');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate(response.data.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('登录失败：' + (error.response?.data?.message || '未知错误'));
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
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '请输入用户名！' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />}
                            placeholder="请输入用户名"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码！' },
                            { min: 6, message: '密码至少6个字符！' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="请输入密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="auth-form-forgot">
                            <Link to="/forgot-password">忘记密码？</Link>
                        </div>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <Link to="/register">还没有账号？立即注册</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
