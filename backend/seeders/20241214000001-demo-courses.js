'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 首先获取教师ID
    const teachers = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'teacher'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (teachers.length < 2) {
      throw new Error('需要至少两个教师账号');
    }

    await queryInterface.bulkInsert('Courses', [
      {
        title: '高中数学基础强化',
        description: '本课程针对高中数学基础知识进行系统性讲解和强化训练，帮助学生打好基础。',
        teacherId: teachers[0].id,
        level: 'intermediate',
        category: '数学',
        status: 'published',
        price: 299,
        duration: 3600, // 60小时
        maxStudents: 100,
        enrollCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '高中物理专题突破',
        description: '系统讲解高中物理重点知识，包含大量例题讲解和实验演示。',
        teacherId: teachers[1].id,
        level: 'intermediate',
        category: '物理',
        status: 'published',
        price: 399,
        duration: 4800, // 80小时
        maxStudents: 80,
        enrollCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '高考数学冲刺班',
        description: '针对高考数学复习和备考，包含历年真题解析和考点预测。',
        teacherId: teachers[0].id,
        level: 'advanced',
        category: '数学',
        status: 'published',
        price: 599,
        duration: 2400, // 40小时
        maxStudents: 50,
        enrollCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
