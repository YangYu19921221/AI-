'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // 插入标签数据
    const tags = [
      // 学科标签
      { name: '数学', category: 'subject', description: '数学相关课程', created_at: now, updated_at: now },
      { name: '物理', category: 'subject', description: '物理相关课程', created_at: now, updated_at: now },
      { name: '化学', category: 'subject', description: '化学相关课程', created_at: now, updated_at: now },
      { name: '生物', category: 'subject', description: '生物相关课程', created_at: now, updated_at: now },
      
      // 难度标签
      { name: '入门', category: 'level', description: '适合初学者', created_at: now, updated_at: now },
      { name: '进阶', category: 'level', description: '需要一定基础', created_at: now, updated_at: now },
      { name: '高级', category: 'level', description: '适合有经验的学习者', created_at: now, updated_at: now },
      
      // 特色标签
      { name: 'AI辅导', category: 'feature', description: '提供AI辅导功能', created_at: now, updated_at: now },
      { name: '实时互动', category: 'feature', description: '支持师生实时互动', created_at: now, updated_at: now },
      { name: '视频课程', category: 'feature', description: '包含视频教学', created_at: now, updated_at: now },
      { name: '练习题', category: 'feature', description: '包含练习题', created_at: now, updated_at: now },
      
      // 考试类型标签
      { name: '高考', category: 'exam', description: '高考相关', created_at: now, updated_at: now },
      { name: '中考', category: 'exam', description: '中考相关', created_at: now, updated_at: now },
      { name: '竞赛', category: 'exam', description: '学科竞赛相关', created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('tags', tags, {});

    // 为示例课程添加标签
    const [courses, coursesMetadata] = await queryInterface.sequelize.query(
      'SELECT id FROM courses LIMIT 5;'
    );
    
    const [tagRows, tagsMetadata] = await queryInterface.sequelize.query(
      'SELECT id FROM tags;'
    );

    const courseTags = [];
    courses.forEach(course => {
      // 随机选择2-4个标签
      const numTags = Math.floor(Math.random() * 3) + 2;
      const selectedTags = new Set();
      
      while (selectedTags.size < numTags && selectedTags.size < tagRows.length) {
        const randomTag = tagRows[Math.floor(Math.random() * tagRows.length)];
        if (!selectedTags.has(randomTag.id)) {
          selectedTags.add(randomTag.id);
          courseTags.push({
            course_id: course.id,
            tag_id: randomTag.id,
            created_at: now,
            updated_at: now
          });
        }
      }
    });

    await queryInterface.bulkInsert('course_tags', courseTags, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('course_tags', null, {});
    await queryInterface.bulkDelete('tags', null, {});
  }
};
