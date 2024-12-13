const sequelize = require('../config/database');
const User = require('../models/user');

async function initDatabase() {
    try {
        // 同步所有模型
        await sequelize.sync({ force: true });
        console.log('数据库表创建成功');

        // 创建测试用户
        await User.create({
            username: 'test',
            email: 'test@example.com',
            password: 'password123',
            role: 'student',
            phone: '13800138000'  // 添加手机号
        });
        console.log('测试用户创建成功');

        console.log('数据库初始化完成');
        process.exit(0);
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
}

initDatabase();
