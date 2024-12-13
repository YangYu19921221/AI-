import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5173/api',
    timeout: 10000,
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
                    window.location.href = '/login';
                    break;
                case 403:
                    // 权限不足
                    console.error('没有权限执行此操作');
                    break;
                case 500:
                    // 服务器错误
                    console.error('服务器错误');
                    break;
                default:
                    console.error(error.response.data.message || '请求失败');
            }
        } else if (error.request) {
            console.error('无法连接到服务器');
        } else {
            console.error('请求配置错误');
        }
        return Promise.reject(error);
    }
);

export default instance;
