const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  middleName: {
    type: Sequelize.STRING
  },
  login: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  managerId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    }
  }
});

module.exports = User;
