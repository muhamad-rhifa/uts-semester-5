-- ====================================================================
-- SKEMA DATABASE: VIAJERSEY SPK (WEIGHTED PRODUCT)
-- Versi: 1.0 (Phase 4)
-- RDBMS: MySQL 8.0+
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `material_scores`;
DROP TABLE IF EXISTS `criteria`;
DROP TABLE IF EXISTS `materials`;
DROP TABLE IF EXISTS `admins`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. TABEL: admins
-- Menyimpan data kredensial pengelola sistem
-- --------------------------------------------------------------------
CREATE TABLE `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `email` VARCHAR(128) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `nama_lengkap` VARCHAR(128) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. TABEL: materials
-- Menyimpan data alternatif bahan kain jersey
-- --------------------------------------------------------------------
CREATE TABLE `materials` (
  `id` VARCHAR(16) NOT NULL PRIMARY KEY, -- Contoh: FAB-001
  `nama` VARCHAR(128) NOT NULL,
  `slug` VARCHAR(128) NOT NULL UNIQUE,
  `deskripsi` TEXT NOT NULL,
  `harga_demo` INT UNSIGNED NOT NULL, -- Rupiah positif (> 0)
  `kelebihan_json` JSON NOT NULL, -- Array string poin kelebihan
  `status` ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  `gambar_url` TEXT NULL, -- URL gambar atau base64 data thumbnail
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_materials_slug` (`slug`),
  INDEX `idx_materials_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. TABEL: criteria
-- Menyimpan definisi 7 kriteria Weighted Product
-- --------------------------------------------------------------------
CREATE TABLE `criteria` (
  `kode` VARCHAR(8) NOT NULL PRIMARY KEY, -- C1 s.d. C7
  `nama` VARCHAR(128) NOT NULL,
  `tipe` ENUM('benefit', 'cost') NOT NULL, -- Ditentukan oleh aturan / admin
  `satuan` VARCHAR(32) NOT NULL, -- Rupiah, Skor 1-5
  `bobot_default` TINYINT UNSIGNED NOT NULL DEFAULT 3, -- 1-5
  `status` VARCHAR(32) NOT NULL DEFAULT 'Aktif',
  `deskripsi` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. TABEL: material_scores
-- Matriks skor nilai karakteristik setiap bahan terhadap kriteria
-- --------------------------------------------------------------------
CREATE TABLE `material_scores` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `material_id` VARCHAR(16) NOT NULL,
  `criterion_kode` VARCHAR(8) NOT NULL,
  `nilai` DOUBLE NOT NULL, -- Nilai positif: harga untuk C1, skor 1-5 untuk C2-C7
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_material_criterion` (`material_id`, `criterion_kode`),
  CONSTRAINT `fk_scores_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_scores_criterion` FOREIGN KEY (`criterion_kode`) REFERENCES `criteria` (`kode`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
