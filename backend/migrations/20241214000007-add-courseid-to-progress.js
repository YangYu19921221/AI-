'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Progresses', 'courseId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Progresses', 'courseId');
  }
};
