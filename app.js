const express = require("express")
const bodyParser = require("body-parser")
const sequelize = require("./config/db")
const authRoutes = require("./routes/auth")

const app = express()
app.use(bodyParser.json())

app.use("/api", authRoutes)

sequelize.authenticate()
    .then(() => {
        console.log("Database terhubung")
        app.listen(3000, () => console.log("Server berjalan pada port: 3000"))
    })

    .catch(err => console.log("Database tidak terhubung"))