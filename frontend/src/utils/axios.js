import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未授权，清除token并跳转到登录页
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    // 保存当前路径
                    localStorage.setItem('redirectPath', window.location.pathname);
                    message.error('登录已过期，请重新登录');
                    // 使用 window.location 而不是 navigate，确保完全刷新
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
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
            message.error('无法连接到服务器');
        } else {
            message.error('请求配置错误');
        }
        return Promise.reject(error);
    }
);

export default instance;
