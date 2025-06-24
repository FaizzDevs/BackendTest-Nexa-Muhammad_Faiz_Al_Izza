const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const bearer = req.headers.authorization; // mengambil token yang diterima di postman

    if(!bearer || !bearer.startsWith("Bearer")) // pengecekan bearer
        return res.status(401).json({ message: "Token tidak ada" })

    const token = bearer.split(" ")[1] // memisahkan token

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // verifikasi jwt
        req.admin = decoded;
        next();

    } catch {
        return res.status(403).json({ message: "Token tidak sesuai atau kadaluarsa" })
    }
}

module.exports = verifyToken;