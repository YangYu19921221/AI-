'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先创建枚举类型
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_assignments_type" AS ENUM ('quiz', 'project', 'essay');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_assignments_status" AS ENUM ('draft', 'published', 'closed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.createTable('Assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false
      },
      totalScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      type: {
        type: "enum_assignments_type",
        allowNull: false
      },
      requirements: {
        type: Sequelize.JSON,
        allowNull: true
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: "enum_assignments_status",
        defaultValue: 'draft'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('Assignments', ['courseId']);
    await queryInterface.addIndex('Assignments', ['status']);
    await queryInterface.addIndex('Assignments', ['deadline']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Assignments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assignments_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assignments_status";');
  }
};
