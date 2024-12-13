import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [step, setStep] = useState(1); // 1: 验证手机号, 2: 重置密码

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
            const response = await axios.post('http://localhost:3001/api/users/send-code', { 
                phone,
                type: 'reset'
            });
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

    const verifyPhone = async (values) => {
        try {
            const response = await axios.post('http://localhost:3001/api/users/verify-code', {
                phone: values.phone,
                code: values.verificationCode,
                type: 'reset'
            });
            if (response.data.success) {
                message.success('验证成功！');
                setStep(2);
            }
        } catch (error) {
            message.error('验证失败：' + (error.response?.data?.message || '未知错误'));
        }
    };

    const resetPassword = async (values) => {
        try {
            const response = await axios.post('http://localhost:3001/api/users/reset-password', {
                phone: form.getFieldValue('phone'),
                newPassword: values.newPassword
            });
            if (response.data.success) {
                message.success('密码重置成功！');
                navigate('/login');
            }
        } catch (error) {
            message.error('密码重置失败：' + (error.response?.data?.message || '未知错误'));
        }
    };

    const renderStep1 = () => (
        <Form
            form={form}
            name="verify-phone"
            onFinish={verifyPhone}
            autoComplete="off"
            size="large"
        >
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

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    下一步
                </Button>
            </Form.Item>
        </Form>
    );

    const renderStep2 = () => (
        <Form
            form={form}
            name="reset-password"
            onFinish={resetPassword}
            autoComplete="off"
            size="large"
        >
            <Form.Item
                name="newPassword"
                rules={[
                    { required: true, message: '请输入新密码！' },
                    { min: 6, message: '密码至少6个字符！' }
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入新密码"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                    { required: true, message: '请确认新密码！' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入的密码不一致！'));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请确认新密码"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    重置密码
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <div className="auth-container">
            <div className="decoration-circle decoration-circle-1" />
            <div className="decoration-circle decoration-circle-2" />
            
            <div className="auth-card">
                <h1 className="auth-title">
                    重置密码
                    <span className="auth-subtitle">
                        {step === 1 ? '验证手机号' : '设置新密码'}
                    </span>
                </h1>

                {step === 1 ? renderStep1() : renderStep2()}

                <div className="auth-links">
                    <Link to="/login">返回登录</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
