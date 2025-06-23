const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("gmedia_democase", "gmedia_democase2", "Janglidalam29J", { // database, username, password
    host: "gmedia.bz",
    dialect: "mysql",
    port: 3306,
    logging: false,
})

module.exports = sequelize