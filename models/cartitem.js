"use strict";

module.exports = (sequelize, DataTypes) => {
  let CartItem = sequelize.define("cartItem", {
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
  return CartItem;
};
