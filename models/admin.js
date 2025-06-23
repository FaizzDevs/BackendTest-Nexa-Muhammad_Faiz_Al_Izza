const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const Admin = sequelize.define("admin", {  // model untuk terhubung dengan tabel admin
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.TEXT, allowNull: false },
}, {
    tableName: "admin",
    timestamps: false
})

module.exports = Admin