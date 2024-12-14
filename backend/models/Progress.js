const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Progress = sequelize.define('Progress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    chapterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Chapters',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'not_started'
    },
    progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Progresses',
    timestamps: true
});

module.exports = Progress;
