import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendVerificationCode = async () => {
        try {
            const phone = form.getFieldValue('phone');
            if (!phone) {
                message.error('请先输入手机号！');
                return;
            }
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                message.error('请输入有效的手机号！');
                return;
            }
            
            setLoading(true);
            const response = await axios.post('http://localhost:3001/api/users/send-code', { phone });
            if (response.data.success) {
                message.success('验证码已发送！');
                startCountdown();
            }
        } catch (error) {
            message.error('发送验证码失败：' + (error.response?.data?.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        try {
            // 添加默认的学生角色
            const userData = { ...values, role: 'student' };
            const response = await axios.post('http://localhost:3001/api/users/register', userData);
            if (response.data.success) {
                message.success('注册成功！');
                navigate('/login');
            }
        } catch (error) {
            message.error('注册失败：' + (error.response?.data?.message || '未知错误'));
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
                    form={form}
                    name="register"
                    className="auth-form"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '请输入用户名！' },
                            { min: 2, message: '用户名至少2个字符！' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />}
                            placeholder="请输入用户名"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号！' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号！' }
                        ]}
                    >
                        <Input
                            prefix={<MobileOutlined />}
                            placeholder="请输入手机号"
                        />
                    </Form.Item>

                    <Form.Item
                        name="verificationCode"
                        rules={[
                            { required: true, message: '请输入验证码！' },
                            { len: 6, message: '验证码为6位数字！' }
                        ]}
                    >
                        <div className="verification-code-container">
                            <Input
                                placeholder="请输入验证码"
                                maxLength={6}
                            />
                            <Button
                                type="primary"
                                onClick={sendVerificationCode}
                                disabled={countdown > 0}
                                loading={loading}
                                className="verification-code-button"
                            >
                                {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                            </Button>
                        </div>
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

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '请确认密码！' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致！'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="请确认密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            注册
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <Link to="/login">已有账号？立即登录</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
