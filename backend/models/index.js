const User = require('./user');
const Course = require('./course');
const Lesson = require('./lesson');
const Enrollment = require('./enrollment');

// 定义模型之间的关系
Course.belongsTo(User, { as: 'teacher', foreignKey: 'teacherId' });
User.hasMany(Course, { as: 'teachingCourses', foreignKey: 'teacherId' });

Course.hasMany(Lesson, { foreignKey: 'courseId' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

Course.belongsToMany(User, { 
    through: Enrollment,
    as: 'students',
    foreignKey: 'courseId'
});
User.belongsToMany(Course, { 
    through: Enrollment,
    as: 'enrolledCourses',
    foreignKey: 'studentId'
});

module.exports = {
    User,
    Course,
    Lesson,
    Enrollment
};
