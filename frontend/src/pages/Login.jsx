import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import '../styles/auth.css';

// 配置 axios 默认值
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:3000';

const Login = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await axios.post('/auth/login', values);
            
            if (response.success) {
                const { token, user } = response.data;
                
                // 先设置用户信息，再设置 token
                sessionStorage.setItem('userInfo', JSON.stringify(user));
                sessionStorage.setItem('token', token);
                
                message.success('登录成功！');
                
                // 获取之前保存的路径
                const redirectPath = sessionStorage.getItem('redirectPath');
                sessionStorage.removeItem('redirectPath'); // 清除保存的路径
                
                // 如果有保存的路径就跳转回去，否则跳转到默认仪表盘
                if (redirectPath) {
                    navigate(redirectPath);
                } else {
                    const dashboardPath = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
                    navigate(dashboardPath);
                }
            } else {
                message.error(response.message || '登录失败');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('登录失败：' + (error.response?.data?.message || '服务器错误'));
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
                    className="login-form"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名！'
                            }
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
                                message: '请输入密码！'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item className="form-actions">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="login-form-button"
                            size="large"
                            block
                        >
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
