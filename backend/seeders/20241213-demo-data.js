'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 创建测试用户
    await queryInterface.bulkInsert('Users', [
      {
        name: '测试学生',
        username: 'student',
        email: 'student@test.com',
        phone: '13800138000',
        password: await bcrypt.hash('123456', 10),
        role: 'student',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '测试教师',
        username: 'teacher',
        email: 'teacher@test.com',
        phone: '13800138001',
        password: await bcrypt.hash('123456', 10),
        role: 'teacher',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 创建测试课程
    await queryInterface.bulkInsert('Courses', [
      {
        title: 'JavaScript基础教程',
        description: '从零开始学习JavaScript编程语言',
        level: 'beginner',
        category: 'programming',
        coverImage: 'https://example.com/js-cover.jpg',
        teacherId: 2, // teacher用户的ID
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'React入门到精通',
        description: '学习React框架开发现代Web应用',
        level: 'intermediate',
        category: 'programming',
        coverImage: 'https://example.com/react-cover.jpg',
        teacherId: 2,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 创建测试课时
    await queryInterface.bulkInsert('Lessons', [
      {
        title: '变量和数据类型',
        content: 'JavaScript中的变量声明和基本数据类型介绍',
        courseId: 1,
        order: 1,
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        duration: 1800,
        resources: JSON.stringify([
          { type: 'pdf', url: 'https://example.com/js-basics.pdf', name: '课程讲义' }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '函数和作用域',
        content: '函数定义、调用和作用域概念详解',
        courseId: 1,
        order: 2,
        videoUrl: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY',
        duration: 2400,
        resources: JSON.stringify([
          { type: 'pdf', url: 'https://example.com/js-functions.pdf', name: '课程讲义' }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 创建测试选课记录
    await queryInterface.bulkInsert('Enrollments', [
      {
        studentId: 1,
        courseId: 1,
        enrolledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 1,
        courseId: 2,
        enrolledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Enrollments', null, {});
    await queryInterface.bulkDelete('Lessons', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
