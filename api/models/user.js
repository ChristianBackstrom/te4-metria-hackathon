'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Plot, {
        foreignKey: 'userId',
    });
    }
  };
  User.init({
    name: DataTypes.STRING,
    money: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};