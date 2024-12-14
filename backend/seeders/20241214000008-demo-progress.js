'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 获取学生ID
    const students = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'student' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (students.length === 0) {
      throw new Error('需要至少一个学生账号');
    }

    // 获取课程和其第一个章节的ID
    const coursesWithChapters = await queryInterface.sequelize.query(
      `SELECT c.id as course_id, ch.id as chapter_id 
       FROM "Courses" c 
       LEFT JOIN "Chapters" ch ON ch."courseId" = c.id 
       GROUP BY c.id, ch.id 
       LIMIT 3`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (coursesWithChapters.length === 0) {
      throw new Error('需要至少一个课程');
    }

    // 为学生添加选课记录
    const progresses = coursesWithChapters.map(course => ({
      studentId: students[0].id,
      courseId: course.course_id,
      chapterId: course.chapter_id || 1, // 如果没有章节，使用默认值1
      status: 'in_progress',
      progress: Math.floor(Math.random() * 100),
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Progresses', progresses);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Progresses', null, {});
  }
};
