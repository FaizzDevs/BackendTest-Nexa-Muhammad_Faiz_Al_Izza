const express = require('express')
const jwt = require("jsonwebtoken")
const CryptoJS = require("crypto-js")

const Admin = require("../models/admin")
const AdminToken = require("../models/adminToken")

const router = express.Router();
const SECRET_KEY = "nexatest"

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ message: "Mohon isi Username dan Password" })
    }

    
    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString()

    Admin.findOne({ where: { username, password: encryptedPassword } })
        .then(admin => {
            if (!admin) {
                return res.status(401).json({ message: "Username atau Password anda salah" })
            }

            const payload = {
                username,
                enc_pass: encryptedPassword,
                timestamp: new Date().toISOString()
            }

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" })
            return AdminToken.create({
                admin_id: admin.id,
                token
            }).then(() => {
                res.json({ token })
            })
        })

        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Something went wrong" })
        })
})

module.exports = router;
