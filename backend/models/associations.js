const User = require('./user');
const Course = require('./course');
const Assignment = require('./assignment');
const Submission = require('./submission');
const Comment = require('./comment');
const Chapter = require('./chapter');
const Progress = require('./progress');
const CourseReview = require('./courseReview');
const Tag = require('./tag');
const CourseTag = require('./courseTag');

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

    // 评论模型的关联关系
    Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
    User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' });
    Comment.belongsTo(Course, { foreignKey: 'courseId' });
    Course.hasMany(Comment, { as: 'comments', foreignKey: 'courseId' });
    Comment.belongsTo(Assignment, { foreignKey: 'assignmentId' });
    Assignment.hasMany(Comment, { as: 'comments', foreignKey: 'assignmentId' });
    Comment.belongsTo(Submission, { foreignKey: 'submissionId' });
    Submission.hasMany(Comment, { as: 'comments', foreignKey: 'submissionId' });

    // 课程和章节的关系
    Course.hasMany(Chapter, { foreignKey: 'course_id' });
    Chapter.belongsTo(Course, { foreignKey: 'course_id' });

    // 学习进度关系
    Progress.belongsTo(User, { as: 'student', foreignKey: 'student_id' });
    Progress.belongsTo(Course, { foreignKey: 'course_id' });
    Progress.belongsTo(Chapter, { foreignKey: 'chapter_id' });

    User.hasMany(Progress, { as: 'progress', foreignKey: 'student_id' });
    Course.hasMany(Progress, { foreignKey: 'course_id' });
    Chapter.hasMany(Progress, { foreignKey: 'chapter_id' });

    // 课程评论关系
    CourseReview.belongsTo(User, { as: 'student', foreignKey: 'student_id' });
    CourseReview.belongsTo(Course, { foreignKey: 'course_id' });

    User.hasMany(CourseReview, { as: 'reviews', foreignKey: 'student_id' });
    Course.hasMany(CourseReview, { as: 'reviews', foreignKey: 'course_id' });

    // 课程标签关系
    Course.belongsToMany(Tag, { 
        through: CourseTag,
        foreignKey: 'course_id',
        otherKey: 'tag_id',
        as: 'tags'
    });

    Tag.belongsToMany(Course, {
        through: CourseTag,
        foreignKey: 'tag_id',
        otherKey: 'course_id',
        as: 'courses'
    });
}

module.exports = setupAssociations;
