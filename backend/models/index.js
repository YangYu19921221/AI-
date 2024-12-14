const User = require('./User');
const Course = require('./Course');
const Chapter = require('./Chapter');
const Progress = require('./Progress');

// 定义模型之间的关系
Course.belongsTo(User, { as: 'teacher', foreignKey: 'teacherId' });
User.hasMany(Course, { as: 'teachingCourses', foreignKey: 'teacherId' });

Course.hasMany(Chapter, { foreignKey: 'courseId' });
Chapter.belongsTo(Course, { foreignKey: 'courseId' });

// 学习进度关联
Progress.belongsTo(User, { foreignKey: 'userId' });
Progress.belongsTo(Course, { foreignKey: 'courseId' });
Progress.belongsTo(Chapter, { foreignKey: 'chapterId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Course.hasMany(Progress, { foreignKey: 'courseId' });
Chapter.hasMany(Progress, { foreignKey: 'chapterId' });

module.exports = {
    User,
    Course,
    Chapter,
    Progress
};
