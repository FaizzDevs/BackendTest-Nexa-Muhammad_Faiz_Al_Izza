const express = require("express")
const karyawan = require("../models/karyawan")
const verifyToken = require("../middleware/auth")
const { Op } = require("sequelize")

const router = express.Router()

// INSERT DATA KARYAWAN
router.post("/karyawan", verifyToken, async(req, res) => {
    const { nama, alamat, gend, photo, tgl_lahir, status } = req.body; // column yang diisi value secara manual

    if( !nama || !alamat || !gend || !photo || !tgl_lahir| status === undefined) { // pengecekan apakah sudah terisi semua
        return res.status(400).json({ message: "Wajib diisi semua" })
    }

    if(!photo.startsWith("data:image/")) { // pengecekan photo harus sesua formatnya
        return res.status(400).json({ message: "format photo harus base64" })
    }

    try {
        const tahun = new Date().getFullYear().toString() // mengambil tahun
        const last = await karyawan.findOne({
            where: { nip: {[Op.like]: `${tahun}%`} }, // membuat nip dimana tahun berada di depan
            order: [["nip", "DESC"]] // mengurutkan
        })

        let urutan = 1; // default jika belum ada nip sebelumnya
        if (last && last.nip){ // mengecek apakah ada data terakhir dan punya properti nip
            const lastCounter = parseInt(last.nip.slice(4)) //mengambil angka urut dari nip terakhir jumlah 4 digit
            if(!isNaN(lastCounter)){
                urutan = lastCounter + 1;
            }
        }

        const newNip = `${tahun}${urutan.toString().padStart(4, "0")}` //membuat nip baru dengan gabungan 2 variable

        const maxId = await karyawan.max("id");
        const nextId = (maxId || 0) + 1; 

        const newKaryawan = await karyawan.create({ //membuat value pada database
            nip: newNip, 
            nama, 
            alamat, 
            gend, 
            photo, 
            tgl_lahir, 
            status, 
            insert_by: req.admin?.username || "sistem", 
            updated_by: req.admin?.username || "sistem", 
            id: nextId
        })

        return res.status(201).json({
            message: "Karyawan berhasil ditambahkan",
            karyawan: newKaryawan
        })

    } catch (error) {
        console.log("Gagal menambahkan", error)
        return res.status(500).json({ message: "Gagal menyimpan karyawan" })
    }
})


// GET DATA KARYAWAN
router.get("/karyawan", verifyToken, async(req, res) => {
    let { keyword = "", start = 0, count = 10 } = req.query

    start = parseInt(start)
    count = parseInt(count)

    if(isNaN(start) || isNaN(count)) {
        return res.status(400).json({ message: "Harus berupa angka" })
    }

    try {
        const result = await karyawan.findAll({
            where: {
                nama: { [Op.like]: `%${keyword}%` }
            },
            offset: parseInt(start),
            limit: parseInt(count),
            order: [["nama", "ASC"]]
        })

        if(!result || result.length === 0) {
            return res.status(404).json({ message: "Data tidak ada" })
        }

        return res.json({
            message: "Daftar Karyawan berhasil ditampilkan",
            data: result
        })

    } catch (error) {
        console.log("Gagal mengambil data karyawan", error)
        return res.status(500).json({ message: "Terjadi kesalahan dalam mengambilan data" })
    }
})


// UPDATE DATA KARYAWAN
router.put("/karyawan/:nip", verifyToken, async(req, res) => {
    const { nip } = req.params;
    const { nama, alamat, gend, photo, tgl_lahir, status } = req.body

    if(!nama || !alamat || !gend || !photo || !tgl_lahir || status === undefined) {
        return res.status(400).json({ message: "Wajib diisi semua" })
    }

    if(!photo.startsWith("data:image/")) {
        return res.status(400).json({ message: "format photo harus base64" })
    }

    try {
        const existingKaryawan = await karyawan.findOne({ where: { nip } })  // pengecekan apakah data ada pada database atau tidak
        if(!existingKaryawan) {
            return res.status(404).json({ message: "Data tidak ditemukan" })
        }

        await karyawan.update({  //melakukan update data berdasarkan apa yang diinput
            nama,
            alamat,
            gend,
            photo,
            tgl_lahir,
            status,
            update_by: req.admin?.username || "sistem",
            update_at: new Date()
        }, {
            where: { nip } //dimana perbarui data perdasarkan data nip
        })
        return res.status(200).json({
            message: "Data berhasil diperbarui"
        })

    } catch (error) {
        console.log("Gagal memperbarui", error)
        return res.status(500).json({ message: "Gagal memperbarui data" })
    }
})

router.patch("/karyawan/nonaktif/:nip", verifyToken, async(req, res) => {
    const { nip } = req.params

    if(!nip || nip.trim() === ""){
        return res.status(400).json({ message: "isi NIP nya" })
    }

    try {
        const dataKaryawan = await karyawan.findOne({ where: { nip } })
        if(!dataKaryawan){
            return res.status(404).json({ message: "Data tidak ditemukan" })
        }

        dataKaryawan.status = 9;
        dataKaryawan.update_by = req.admin?.username || "sistem";
        dataKaryawan.update_at = new Date();

        await dataKaryawan.save();
        return res.status(200).json({
            message: "Data berhasil nonaktif",
            karyawan: dataKaryawan
        })
        
    } catch (error) {
        console.log("Gagal menonaktifkan", error)
        return res.status(500).json({ message: "Ada kesalahan saat menonaktifkan" })
    }
})

module.exports = router