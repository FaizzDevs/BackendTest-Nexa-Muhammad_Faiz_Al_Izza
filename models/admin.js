const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Admin = sequelize.define("admin", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: DataTypes.STRING,
  password: DataTypes.BLOB
}, {
  tableName: "admin",
  timestamps: false
});

module.exports = Admin;
