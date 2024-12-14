'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 获取课程ID
    const courses = await queryInterface.sequelize.query(
      `SELECT id, title FROM "Courses"`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (courses.length === 0) {
      throw new Error('需要至少一个课程');
    }

    // 为每个课程创建章节
    for (const course of courses) {
      const chapters = [];
      const chapterCount = 5; // 每个课程5个章节

      for (let i = 1; i <= chapterCount; i++) {
        chapters.push({
          courseId: course.id,
          title: `第${i}章 - ${getChapterTitle(course.title, i)}`,
          description: getChapterDescription(course.title, i),
          orderNum: i,
          duration: 60, // 每章节60分钟
          status: 'published',
          videoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await queryInterface.bulkInsert('Chapters', chapters);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Chapters', null, {});
  }
};

// 根据课程标题和章节序号生成章节标题
function getChapterTitle(courseTitle, chapterNumber) {
  if (courseTitle.includes('数学')) {
    const titles = [
      '函数与导数',
      '三角函数',
      '概率与统计',
      '立体几何',
      '数列与极限'
    ];
    return titles[chapterNumber - 1];
  } else if (courseTitle.includes('物理')) {
    const titles = [
      '力学基础',
      '热学',
      '电磁学',
      '光学',
      '近代物理'
    ];
    return titles[chapterNumber - 1];
  } else {
    return `章节${chapterNumber}`;
  }
}

// 根据课程标题和章节序号生成章节描述
function getChapterDescription(courseTitle, chapterNumber) {
  if (courseTitle.includes('数学')) {
    const descriptions = [
      '本章将系统讲解函数、导数的概念和应用，包括函数的定义、性质、导数的几何意义等。',
      '本章将深入学习三角函数的定义、图像、性质以及三角恒等变换等内容。',
      '本章将介绍概率论与统计学的基本概念，包括随机事件、条件概率、数据分析等。',
      '本章将学习立体几何的基本概念，包括空间向量、空间几何体的性质和计算等。',
      '本章将讲解数列的概念、性质，以及数列极限的相关内容。'
    ];
    return descriptions[chapterNumber - 1];
  } else if (courseTitle.includes('物理')) {
    const descriptions = [
      '本章将学习牛顿运动定律、功和能、动量等力学基础知识。',
      '本章将介绍热力学基本定律、气体状态方程等热学知识。',
      '本章将学习电场、磁场、电磁感应等电磁学知识。',
      '本章将讲解几何光学、波动光学等光学知识。',
      '本章将介绍近代物理基础，包括原子物理、量子力学初步等。'
    ];
    return descriptions[chapterNumber - 1];
  } else {
    return `这是第${chapterNumber}章的详细描述。`;
  }
}
