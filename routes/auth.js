const express = require("express");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Admin = require("../models/admin");
const AdminToken = require("../models/adminToken");
require("dotenv").config();

const router = express.Router()
const AES_KEY = process.env.SECRET_KEY
const JWT_SECRET = process.env.JWT_SECRET

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ message: "Username dan password mohon diisi" })

  try {
    const existing = await Admin.findOne({ where: { username } }) // Cek username sudah ada atau belum
    if (existing) return res.status(409).json({ message: "Username sudah terdaftar." })

    const encrypted = CryptoJS.AES.encrypt(password, AES_KEY).toString(); // Enkripsi dan ubah ke Buffer agar cocok dengan kolom type VARBINARY
    const encryptedBuffer = Buffer.from(encrypted, "utf-8")

    const newAdmin = await Admin.create({  // Simpan admin baru
      username,
      password: encryptedBuffer
    });

    return res.status(201).json({
      message: "Admin sukses dibuat",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Gagal register admin." })
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ message: "Username dan password mohon diisi" })

  try {
    const admin = await Admin.findOne({ where: { username } })

    if (!admin)
      return res.status(401).json({ message: "Username tidak ada." })

    const encryptedString = admin.password.toString("utf-8") // Ubah Buffer password ke string sebelum didekripsi
    const decryptedPassword = CryptoJS.AES.decrypt(encryptedString, AES_KEY).toString(CryptoJS.enc.Utf8)

    if (decryptedPassword !== password)
      return res.status(401).json({ message: "Password salah." })

    const payload = {
      id: admin.id,
      username: admin.username,
      time: Date.now()
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }) // token kadaluarsa dalam 1 jam

    await AdminToken.create({ // menyimpan toke pada table database
      id_admin: admin.id,
      token,
      expired_at: new Date(Date.now() + 3600 * 1000) 
    });

    return res.json({ message: "Login berhasil", token })

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat login." })
  }
});

module.exports = router;
