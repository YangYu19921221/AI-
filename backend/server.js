const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const courseRoutes = require('./routes/courseRoutes');
const path = require('path');

const app = express();

// CORS配置
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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
        await sequelize.authenticate();
        console.log('数据库连接成功');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`服务器运行在 http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('启动服务器失败:', error);
        process.exit(1);
    }
}

startServer();
