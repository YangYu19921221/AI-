const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const setupAssociations = require('./models/associations');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
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

// 设置模型关联关系
try {
    setupAssociations();
    console.log('模型关联设置成功');
} catch (error) {
    console.error('设置模型关联失败:', error);
}

const app = express();

// CORS配置
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 测试路由
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// 路由
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', assignmentRoutes);

// 错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
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
        console.log('数据库连接成功');
        
        // 同步数据库模型（在开发环境中使用）
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('数据库模型同步成功');
        }
        
        // 启动服务器
        const server = app.listen(PORT, 'localhost', () => {
            console.log(`服务器运行在 http://localhost:${PORT}`);
        });

        server.on('error', (error) => {
            console.error('服务器错误:', error);
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
