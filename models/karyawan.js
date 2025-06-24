const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const karyawan = sequelize.define("karyawan", {
    nip: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    nama: { type: DataTypes.STRING(200), allowNull: false },
    alamat: DataTypes.STRING,
    gend: DataTypes.CHAR(1),
    photo: DataTypes.TEXT,
    tgl_lahir: DataTypes.DATE,
    status: DataTypes.INTEGER,
    insert_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    insert_by: DataTypes.STRING(50),
    update_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    update_by: DataTypes.STRING(50),
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
}, {
    tableName: "karyawan",
    timestamps: false
})

module.exports = karyawan