'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 创建测试用户
    const users = await queryInterface.bulkInsert('Users', [
      {
        username: 'teacher1',
        password: await bcrypt.hash('123456', 10),
        role: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'student1',
        password: await bcrypt.hash('123456', 10),
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // 创建测试课程
    await queryInterface.bulkInsert('Courses', [
      {
        title: 'Python编程基础',
        description: '适合零基础学习的Python入门课程，包含基础语法、数据类型、控制流程等内容。',
        level: 'beginner',
        category: 'programming',
        coverImage: 'https://via.placeholder.com/300x200?text=Python',
        teacherId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Web开发入门',
        description: '学习HTML、CSS和JavaScript的基础知识，开始您的Web开发之旅。',
        level: 'beginner',
        category: 'programming',
        coverImage: 'https://via.placeholder.com/300x200?text=Web',
        teacherId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '数据结构与算法',
        description: '深入学习常用数据结构和算法，提高编程能力和问题解决能力。',
        level: 'intermediate',
        category: 'programming',
        coverImage: 'https://via.placeholder.com/300x200?text=DSA',
        teacherId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '高等数学基础',
        description: '覆盖微积分、线性代数等重要数学概念，为深入学习打下基础。',
        level: 'intermediate',
        category: 'math',
        coverImage: 'https://via.placeholder.com/300x200?text=Math',
        teacherId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '人工智能导论',
        description: '了解AI的基本概念、发展历史和应用领域，探索AI的无限可能。',
        level: 'advanced',
        category: 'science',
        coverImage: 'https://via.placeholder.com/300x200?text=AI',
        teacherId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '英语口语进阶',
        description: '提高英语口语能力，掌握地道的表达方式和交际技巧。',
        level: 'intermediate',
        category: 'language',
        coverImage: 'https://via.placeholder.com/300x200?text=English',
        teacherId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
