const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

// 用户登录
async function login(req, res) {
    const { username, email, password } = req.body;
    try {
        // 查找用户（支持用户名或邮箱登录）
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username || '' },
                    { email: email || '' }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 验证密码
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: '密码错误'
            });
        }

        // 更新最后登录时间
        await user.update({ lastLoginAt: new Date() });

        // 生成 JWT token
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // 返回用户信息和token
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            }
        });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({
            success: false,
            message: '登录失败，请稍后重试'
        });
    }
}

// 用户注册
async function register(req, res) {
    const { name, email, password, role } = req.body;
    try {
        // 检查用户是否已存在
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '该邮箱已被注册'
            });
        }

        // 创建新用户
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student' // 默认角色为学生
        });

        // 生成 JWT token
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // 返回用户信息和token
        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({
            success: false,
            message: '注册失败'
        });
    }
}

// 获取当前用户信息
async function getCurrentUser(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'role']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({
            success: false,
            message: '获取用户信息失败'
        });
    }
}

module.exports = {
    login,
    register,
    getCurrentUser
};
