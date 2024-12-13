const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    'ai_tutoring',  // 统一使用ai_tutoring作为数据库名称
    'yangyu',      // 用户名
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
