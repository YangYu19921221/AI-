const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    try {
        // 从请求头获取token
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: '请先登录'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // 查找用户
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 将用户信息添加到请求对象
        req.user = user;
        next();
    } catch (error) {
        console.error('认证失败:', error);
        res.status(401).json({
            success: false,
            message: '认证失败'
        });
    }
};

// 检查用户角色的中间件
exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: '没有权限执行此操作'
            });
        }
        next();
    };
};
