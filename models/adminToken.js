const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdminToken = sequelize.define("admin_token", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_admin: DataTypes.INTEGER,
  token: DataTypes.TEXT,
  expired_at: DataTypes.DATE
}, {
  tableName: "admin_token",
  timestamps: false
});

module.exports = AdminToken;
