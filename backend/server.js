const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const studentCourseRoutes = require('./routes/studentCourseRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

// 设置环境变量
process.env.NODE_ENV = 'development';

// 设置未捕获的异常处理器
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('未处理的Promise拒绝:', err);
});

const app = express();

// CORS配置
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:3001'];
        // 允许没有origin的请求（比如来自Postman的请求）
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('不允许的来源'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    // 添加更多的请求信息日志
    if (req.headers.authorization) {
        console.log('Token present in request');
    }
    next();
});

// 测试路由
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// API路由
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/student/courses', studentCourseRoutes);
app.use('/api/auth', authRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // 测试数据库连接
        await sequelize.authenticate();
        console.log('数据库连接成功.');
        
        // 同步数据库模型（在开发环境中使用）
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync();
            console.log('数据库模型同步成功');
        }
        
        // 启动服务器
        app.listen(PORT, () => {
            console.log(`服务器运行在端口 ${PORT}`);
        });

    } catch (error) {
        console.error('启动服务器失败:', error);
        process.exit(1);
    }
}

startServer().catch(error => {
    console.error('服务器启动过程中发生错误:', error);
    process.exit(1);
});
