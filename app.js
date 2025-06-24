const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const karyawanRoutes = require("./routes/karyawan")

const app = express();
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", karyawanRoutes)

sequelize.authenticate()
  .then(() => {
    console.log("✅ Koneksi database berhasil");
    app.listen(3000, () => console.log("🚀 Server berjalan di port 3306"));
  })
  .catch(err => console.error("❌ Koneksi gagal:", err));
