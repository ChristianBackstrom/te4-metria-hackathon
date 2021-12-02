'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    static associate(models) {
      Point.belongsTo(models.Plot, {
        foreignKey: 'plotId',
      });
    }
  };
  Point.init({
    plotId: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Point',
  });
  return Point;
};