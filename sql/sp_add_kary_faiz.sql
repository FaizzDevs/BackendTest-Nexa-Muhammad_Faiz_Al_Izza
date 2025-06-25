DELIMITER $$

CREATE PROCEDURE sp_add_kary_faiz (
    IN p_nip VARCHAR(50),
    IN p_nama VARCHAR(200),
    IN p_alamat TEXT,
    IN p_gend CHAR(1),
    IN p_photo TEXT,
    IN p_tgl_lahir DATE,
    IN p_status INT,
    IN p_insert_by VARCHAR(50)
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        INSERT INTO log_trx_api(user_id, api, request, response, insert_at)
        VALUES (p_insert_by, 'sp_add_kary_faiz', CONCAT('nip=', p_nip), 'Gagal simpan: SQL Error', NOW());
    END;

    START TRANSACTION;

    -- Cek apakah NIP sudah ada
    SELECT COUNT(*) INTO v_exists FROM karyawan WHERE nip = p_nip;

    IF v_exists > 0 THEN
        -- Simpan ke log dan rollback
        INSERT INTO log_trx_api(user_id, api, request, response, insert_at)
        VALUES (p_insert_by, 'sp_add_kary_faiz', CONCAT('nip=', p_nip), CONCAT('Gagal simpan: NIP ', p_nip, ' sudah ada'), NOW());
        ROLLBACK;
    ELSE
        -- Simpan data karyawan
        INSERT INTO karyawan(nip, nama, alamat, gend, photo, tgl_lahir, status, insert_at, insert_by, update_at, update_by)
        VALUES (p_nip, p_nama, p_alamat, p_gend, p_photo, p_tgl_lahir, p_status, NOW(), p_insert_by, NOW(), p_insert_by);

        -- Simpan log berhasil
        INSERT INTO log_trx_api(user_id, api, request, response, insert_at)
        VALUES (p_insert_by, 'sp_add_kary_faiz', CONCAT('nip=', p_nip), 'Berhasil simpan data karyawan', NOW());

        COMMIT;
    END IF;

END$$

DELIMITER ;
