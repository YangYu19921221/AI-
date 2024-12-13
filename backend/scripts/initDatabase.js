const sequelize = require('../config/database');
const User = require('../models/user');
const Course = require('../models/course');
const Assignment = require('../models/assignment');
const Submission = require('../models/submission');

async function initDatabase() {
    try {
        // 同步所有模型
        await sequelize.sync({ force: true });
        console.log('数据库表创建成功');

        // 创建测试用户
        const testTeacher = await User.create({
            username: 'teacher',
            password: '123456',
            role: 'teacher',
            name: '张老师',
            phone: '13800138001',
            email: 'teacher@example.com'
        });

        const testStudent = await User.create({
            username: 'student',
            password: '123456',
            role: 'student',
            name: '李同学',
            phone: '13800138002',
            email: 'student@example.com'
        });

        // 创建测试课程
        const testCourse = await Course.create({
            title: 'JavaScript编程基础',
            description: '学习JavaScript编程的基础知识和实践应用',
            level: 'beginner',
            category: 'programming',
            teacherId: testTeacher.id,
            coverImage: 'https://example.com/course-cover.jpg'
        });

        // 创建测试作业
        const testAssignment1 = await Assignment.create({
            courseId: testCourse.id,
            title: '第一次作业：JavaScript基础语法',
            description: '完成以下JavaScript基础语法练习题',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
            totalScore: 100,
            type: 'quiz',
            requirements: [
                '1. 完成变量声明和基本运算',
                '2. 实现条件判断和循环结构',
                '3. 编写简单的函数'
            ],
            status: 'published'
        });

        const testAssignment2 = await Assignment.create({
            courseId: testCourse.id,
            title: '第二次作业：DOM操作',
            description: '完成一个简单的网页交互功能',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14天后
            totalScore: 100,
            type: 'project',
            requirements: [
                '1. 实现页面元素的动态添加和删除',
                '2. 实现表单验证功能',
                '3. 实现简单的动画效果'
            ],
            status: 'published'
        });

        // 创建测试提交记录
        await Submission.create({
            assignmentId: testAssignment1.id,
            studentId: testStudent.id,
            content: '这是我的第一次作业提交',
            status: 'submitted',
            submittedAt: new Date()
        });

        console.log('测试数据初始化完成');
        process.exit(0);
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
}

initDatabase();
