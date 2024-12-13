const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticate } = require('../middleware/auth');

// 初始化测试账号
const initTestAccounts = async () => {
    try {
        // 创建测试学生账号
        const testStudent = await User.findOrCreate({
            where: { username: 'teststudent' },
            defaults: {
                username: 'teststudent',
                phone: '13800000001',
                password: '123456',
                role: 'student'
            }
        });

        // 创建测试教师账号
        const testTeacher = await User.findOrCreate({
            where: { username: 'testteacher' },
            defaults: {
                username: 'testteacher',
                phone: '13800000002',
                password: '123456',
                role: 'teacher'
            }
        });

        // 创建测试管理员账号
        const testAdmin = await User.findOrCreate({
            where: { username: 'testadmin' },
            defaults: {
                username: 'testadmin',
                phone: '13800000003',
                password: '123456',
                role: 'admin'
            }
        });

        console.log('测试账号初始化完成');
    } catch (error) {
        console.error('测试账号初始化失败:', error);
    }
};

// 在应用启动时初始化测试账号
initTestAccounts();

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, phone, password, role = 'student' } = req.body;

        // 检查用户名是否已存在
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '用户名已存在'
            });
        }

        // 创建新用户
        const user = await User.create({
            username,
            phone,
            password,
            role
        });

        // 生成 JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            },
            message: '注册成功'
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({
            success: false,
            message: '注册失败',
            error: error.message
        });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username });

        // 查找用户
        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }

        // 验证密码
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }

        // 更新最后登录时间
        await user.update({ lastLoginAt: new Date() });

        // 生成 JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('Login successful:', username);

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: '登录失败',
            error: error.message
        });
    }
});

// 重置密码
router.post('/reset-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // 查找用户
        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 验证当前密码
        const isMatch = await user.validatePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: '当前密码错误'
            });
        }

        // 更新密码
        await user.update({ password: newPassword });

        res.json({
            success: true,
            message: '密码重置成功'
        });
    } catch (error) {
        console.error('密码重置错误:', error);
        res.status(500).json({
            success: false,
            message: '密码重置失败',
            error: error.message
        });
    }
});

// 获取当前用户信息
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password'] }
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
        console.error('获取用户信息错误:', error);
        res.status(500).json({
            success: false,
            message: '获取用户信息失败',
            error: error.message
        });
    }
});

module.exports = router;
