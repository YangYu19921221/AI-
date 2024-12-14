const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
    try {
        // 从请求头中获取token
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: '未提供认证令牌'
            });
        }

        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 获取用户信息
        const user = await User.findByPk(decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在'
            });
        }

        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: '用户账号已被禁用'
            });
        }

        // 将用户信息添加到请求对象中
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: '无效的认证令牌'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: '认证令牌已过期'
            });
        }
        next(error);
    }
};
