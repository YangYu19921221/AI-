import axios from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未授权，清除token并跳转到登录页
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('userInfo');
                    // 保存当前路径
                    sessionStorage.setItem('redirectPath', window.location.pathname);
                    message.error('登录已过期，请重新登录');
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error('没有权限访问此资源');
                    break;
                case 404:
                    message.error('请求的资源不存在');
                    break;
                case 500:
                    message.error('服务器错误');
                    break;
                default:
                    message.error('请求失败');
            }
        } else if (error.request) {
            message.error('网络错误，请检查您的网络连接');
        } else {
            message.error('请求配置错误');
        }
        return Promise.reject(error);
    }
);

export default instance;
