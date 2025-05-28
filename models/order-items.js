const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const OrderItems = sequelize.define('orderItems', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = OrderItems;
