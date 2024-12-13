const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Chapter = require('./Chapter');

const Progress = sequelize.define('Progress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id'
        }
    },
    chapterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Chapters',
            key: 'id'
        }
    },
    progress: {
        type: DataTypes.INTEGER,  // 0-100 表示百分比
        defaultValue: 0
    },
    currentTime: {
        type: DataTypes.INTEGER,  // 视频当前播放位置（秒）
        defaultValue: 0
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastStudyTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    totalTime: {
        type: DataTypes.INTEGER,  // 总学习时长（分钟）
        defaultValue: 0
    }
});

// 设置关联关系
Progress.belongsTo(User);
Progress.belongsTo(Course);
Progress.belongsTo(Chapter);

User.hasMany(Progress);
Course.hasMany(Progress);
Chapter.hasMany(Progress);

module.exports = Progress;
