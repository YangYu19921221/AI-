const User = require('./user');
const Course = require('./course');
const Assignment = require('./assignment');
const Submission = require('./submission');

function setupAssociations() {
    // 课程与教师的关系
    Course.belongsTo(User, { as: 'teacher', foreignKey: 'teacherId' });
    User.hasMany(Course, { as: 'teachingCourses', foreignKey: 'teacherId' });

    // 作业与课程的关系
    Assignment.belongsTo(Course, { foreignKey: 'courseId' });
    Course.hasMany(Assignment, { foreignKey: 'courseId' });

    // 提交记录与作业的关系
    Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
    Assignment.hasMany(Submission, { foreignKey: 'assignmentId' });

    // 提交记录与学生的关系
    Submission.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
    User.hasMany(Submission, { as: 'submissions', foreignKey: 'studentId' });
}

module.exports = setupAssociations;
