'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plot extends Model {
    static associate(models) {
      Plot.belongsTo(models.Plot, {
          foreignKey: 'userId',
      });
      Plot.hasMany(models.Point, {
        as: 'polygons',
        foreignKey: 'plotId',
        onDelete: 'CASCADE'
      })
    }
  };
  Plot.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Plot',
  });
  return Plot;
};