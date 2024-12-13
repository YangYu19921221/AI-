const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');

const Chapter = sequelize.define('Chapter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    duration: {
        type: DataTypes.INTEGER,  // 视频时长（秒）
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft'
    }
});

// 设置关联关系
Chapter.belongsTo(Course);
Course.hasMany(Chapter);

module.exports = Chapter;
