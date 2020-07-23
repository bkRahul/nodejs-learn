"use strict";

module.exports = (sequelize, DataTypes) => {
  let OrderItem = sequelize.define("orderItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER
    }
  });
  return OrderItem;
};
