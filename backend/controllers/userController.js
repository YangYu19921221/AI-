const { User } = require('../models');
const jwt = require('jsonwebtoken');

const userController = {
    // 注册
    register: async (req, res) => {
        try {
            const { username, password, role = 'student' } = req.body;

            // 检查用户名是否已存在
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: '用户名已存在'
                });
            }

            // 创建用户
            const user = await User.create({
                username,
                password,
                role
            });

            // 生成 token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
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
                }
            });
        } catch (error) {
            console.error('注册失败:', error);
            res.status(500).json({
                success: false,
                message: '注册失败'
            });
        }
    },

    // 登录
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // 查找用户
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: '用户名或密码错误'
                });
            }

            // 验证密码
            const isValid = await user.validatePassword(password);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: '用户名或密码错误'
                });
            }

            // 生成 token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

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
            console.error('登录失败:', error);
            res.status(500).json({
                success: false,
                message: '登录失败'
            });
        }
    },

    // 获取用户信息
    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: ['id', 'username', 'role']
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
};

module.exports = userController;
