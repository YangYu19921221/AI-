'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        // 管理员账号
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        fullName: '系统管理员',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // 教师账号1
        username: 'teacher1',
        password: hashedPassword,
        email: 'teacher1@example.com',
        fullName: '张老师',
        role: 'teacher',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // 教师账号2
        username: 'teacher2',
        password: hashedPassword,
        email: 'teacher2@example.com',
        fullName: '李老师',
        role: 'teacher',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // 学生账号1
        username: 'student1',
        password: hashedPassword,
        email: 'student1@example.com',
        fullName: '王同学',
        role: 'student',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // 学生账号2
        username: 'student2',
        password: hashedPassword,
        email: 'student2@example.com',
        fullName: '陈同学',
        role: 'student',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // 学生账号3
        username: 'student3',
        password: hashedPassword,
        email: 'student3@example.com',
        fullName: '刘同学',
        role: 'student',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
