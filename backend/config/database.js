const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    'postgres',  // 使用默认的postgres数据库
    'postgres',  // 默认用户名
    process.env.DB_PASS,
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize;
