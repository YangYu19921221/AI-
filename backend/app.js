const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 路由导入
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const courseReviewRoutes = require('./routes/courseReviewRoutes');
const tagRoutes = require('./routes/tagRoutes');
const aiRoutes = require('./routes/aiRoutes');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 路由注册
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', courseReviewRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/ai', aiRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
