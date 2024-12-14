const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = require('./config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        port: config.port,
        logging: console.log,  // 启用SQL日志
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// 测试数据库连接
sequelize.authenticate()
    .then(() => {
        console.log('数据库连接成功');
    })
    .catch(err => {
        console.error('数据库连接失败:', err);
    });

module.exports = sequelize;
