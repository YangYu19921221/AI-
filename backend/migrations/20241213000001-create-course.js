'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先检查并创建枚举类型
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_courses_status') THEN
              CREATE TYPE "enum_Courses_status" AS ENUM ('draft', 'published', 'archived');
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_courses_level') THEN
              CREATE TYPE "enum_Courses_level" AS ENUM ('beginner', 'intermediate', 'advanced');
          END IF;
      END
      $$;
    `);

    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['beginner', 'intermediate', 'advanced']]
        }
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coverImage: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'published',
        validate: {
          isIn: [['draft', 'published', 'archived']]
        }
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Courses');
    // 删除枚举类型
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Courses_status";
      DROP TYPE IF EXISTS "enum_Courses_level";
    `);
  }
};
