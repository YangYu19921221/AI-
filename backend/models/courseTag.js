const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseTag = sequelize.define('CourseTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id'
        }
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Tags',
            key: 'id'
        }
    }
}, {
    tableName: 'CourseTags',
    underscored: true,
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['course_id', 'tag_id']
        }
    ]
});

module.exports = CourseTag;
