"use strict";

module.exports = (sequelize, DataTypes) => {
  let Order = sequelize.define("order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    }
  });
  return Order;
};
