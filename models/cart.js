"use strict";

module.exports = (sequelize, DataTypes) => {
  let Cart = sequelize.define("cart", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    }
  });
  return Cart;
};
