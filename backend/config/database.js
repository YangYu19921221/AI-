const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    'ai_education',  // 数据库名称
    'postgres',      // 用户名
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
