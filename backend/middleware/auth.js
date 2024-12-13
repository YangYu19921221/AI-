const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.authenticate = async (req, res, next) => {
    try {
        // 从请求头获取token
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: '未找到认证令牌，请先登录'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // 验证token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: '登录已过期，请重新登录'
                });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: '无效的认证令牌'
                });
            }
            throw error;
        }
        
        // 查找用户
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在或已被删除'
            });
        }

        // 将用户信息添加到请求对象
        req.user = user;
        next();
    } catch (error) {
        console.error('认证失败:', error);
        res.status(401).json({
            success: false,
            message: '认证失败：' + (error.message || '未知错误')
        });
    }
};

// 检查用户角色的中间件
exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: '权限不足，无法访问此资源'
            });
        }
        next();
    };
};
