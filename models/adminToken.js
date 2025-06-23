const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const AdminToken = sequelize.define("admin_token", {
    admin_id: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
} , {
    tableName: "admin_token",
    timestamps: false
})

module.exports = AdminToken