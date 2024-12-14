'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 获取章节ID
    const chapters = await queryInterface.sequelize.query(
      `SELECT id FROM "chapters" ORDER BY id ASC LIMIT 3;`
    );
    const limitChapterId = chapters[0][0].id;
    const derivativeChapterId = chapters[0][1].id;
    const matrixChapterId = chapters[0][2].id;

    return queryInterface.bulkInsert('key_points', [
      {
        chapter_id: limitChapterId,
        title: '函数的极限定义',
        content: '函数的极限是描述函数在某一点附近的变化趋势...',
        order_num: 1,
        difficulty_level: 'basic',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        chapter_id: derivativeChapterId,
        title: '导数的几何意义',
        content: '导数在几何上表示函数曲线在某点的切线斜率...',
        order_num: 1,
        difficulty_level: 'intermediate',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        chapter_id: matrixChapterId,
        title: '矩阵的加法和数乘',
        content: '矩阵的加法是对应位置的元素相加，数乘是每个元素都乘以该数...',
        order_num: 1,
        difficulty_level: 'basic',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('key_points', null, {});
  }
};
