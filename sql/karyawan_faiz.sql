CREATE OR REPLACE VIEW karyawan_faiz AS
SELECT
    nip AS Nip,
    nama AS Nama,
    alamat AS Alamat,
    CASE
        WHEN gend = 'L' THEN 'Laki - Laki'
        WHEN gend = 'P' THEN 'Perempuan'
        ELSE 'Tidak Diketahui'
    END AS Gend,
    DATE_FORMAT(tgl_lahir, '%d %M %Y') AS `Tanggal Lahir`
FROM karyawan;
