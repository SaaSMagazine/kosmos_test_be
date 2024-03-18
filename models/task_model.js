const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user_model');

const Task = sequelize.define('task', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  deadline: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  priority: {
    type: Sequelize.ENUM('high', 'medium', 'low'),
    defaultValue: 'medium'
  },
  status: {
    type: Sequelize.ENUM('to do', 'in progress', 'done', 'cancelled'),
    defaultValue: 'to do'
  },
  creatorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    }
  },
  assigneeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    }
  }
});

// Relationships
Task.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'creatorId' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigneeId' });

module.exports = Task;
