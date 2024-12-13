'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先创建枚举类型
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_submissions_status" AS ENUM ('draft', 'submitted', 'graded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.createTable('Submissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      assignmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Assignments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: "enum_submissions_status",
        defaultValue: 'draft'
      },
      submittedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      gradedAt: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('Submissions', ['assignmentId']);
    await queryInterface.addIndex('Submissions', ['studentId']);
    await queryInterface.addIndex('Submissions', ['status']);
    await queryInterface.addIndex('Submissions', ['assignmentId', 'studentId'], {
      unique: true,
      name: 'submissions_assignment_student_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Submissions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_submissions_status";');
  }
};
