'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 获取章节和知识点ID
    const chapters = await queryInterface.sequelize.query(
      `SELECT id FROM "chapters" ORDER BY id ASC LIMIT 3;`
    );
    const keyPoints = await queryInterface.sequelize.query(
      `SELECT id FROM "key_points" ORDER BY id ASC LIMIT 3;`
    );

    const limitChapterId = chapters[0][0].id;
    const limitKeyPointId = keyPoints[0][0].id;

    return queryInterface.bulkInsert('exercises', [
      {
        chapter_id: limitChapterId,
        key_point_id: limitKeyPointId,
        question: '求极限：lim(x→0) sin(x)/x',
        answer: '1',
        explanation: '这是一个重要的基本极限，可以通过泰勒展开式证明...',
        difficulty_level: 'medium',
        type: 'short_answer',
        options: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        chapter_id: limitChapterId,
        key_point_id: limitKeyPointId,
        question: '函数f(x)=x^2在x=1处连续吗？',
        answer: '是',
        explanation: '函数在x=1处的极限等于函数值，所以连续',
        difficulty_level: 'easy',
        type: 'true_false',
        options: JSON.stringify(['是', '否']),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('exercises', null, {});
  }
};
