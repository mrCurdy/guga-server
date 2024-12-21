// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
