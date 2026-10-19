-- ====================================================================
-- SEED DATA DEMO PENGEMBANGAN: VIAJERSEY SPK
-- PERINGATAN: Seluruh harga dan skor di bawah adalah data uji ilustratif (PRD §8)
-- dan bukan harga resmi ViaJersey.
-- ====================================================================

-- 1. Admin Akun Demo
-- Password asli: "admin123" (BCrypt hash)
INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `nama_lengkap`) VALUES
(1, 'admin', 'admin@viajersey.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator ViaJersey');

-- 2. Kriteria WP
INSERT INTO `criteria` (`kode`, `nama`, `tipe`, `satuan`, `bobot_default`, `status`, `deskripsi`) VALUES
('C1', 'Harga per pcs', 'cost', 'Rupiah', 5, 'Aktif', 'Semakin rendah harga, semakin diprioritaskan jika bobot harga tinggi.'),
('C2', 'Daya Serap Keringat', 'benefit', 'Skor 1–5', 4, 'Aktif', 'Kemampuan menyerap keringat saat aktivitas olahraga.'),
('C3', 'Tingkat Kelenturan / Elastisitas Kain', 'benefit', 'Skor 1–5', 3, 'Aktif', 'Kelenturan kain untuk keleluasaan bergerak.'),
('C4', 'Kualitas Kecerahan Hasil Printing', 'benefit', 'Skor 1–5', 4, 'Aktif', 'Ketajaman dan kecemerlangan cetak sublimasi.'),
('C5', 'Ketebalan Kain / Gramasi', 'benefit', 'Skor 1–5', 3, 'Aktif', 'Arah kriteria ditetapkan admin (default sementara: benefit).'),
('C6', 'Keawetan Serat / Anti-Berbulu', 'benefit', 'Skor 1–5', 3, 'Aktif', 'Ketahanan tekstur kain terhadap gesekan berulang (pilling).'),
('C7', 'Kecepatan Kering / Quick Dry', 'benefit', 'Skor 1–5', 3, 'Aktif', 'Seberapa cepat kain menguapkan kelembapan setelah basah.');

-- 3. Bahan Kain Alternatif (PRD §8)
INSERT INTO `materials` (`id`, `nama`, `slug`, `deskripsi`, `harga_demo`, `kelebihan_json`, `status`) VALUES
('FAB-001', 'Dryfit Milano', 'dryfit-milano', 'Bahan jersey dryfit dengan tekstur milano yang halus dan nyaman digunakan untuk olahraga ringan hingga sedang.', 45000, '["Ringan dan breathable", "Warna cerah tahan lama", "Nyaman untuk aktivitas harian"]', 'Aktif'),
('FAB-002', 'Benzema', 'benzema', 'Bahan jersey populer dengan keseimbangan antara kenyamanan dan ketahanan printing sublimasi.', 40000, '["Elastis dan fleksibel", "Printing tajam", "Harga terjangkau"]', 'Aktif'),
('FAB-003', 'Serena', 'serena', 'Bahan jersey dengan ketebalan lebih baik, cocok untuk cuaca lebih dingin atau kebutuhan premium feel.', 38000, '["Ketebalan optimal", "Cocok cuaca dingin", "Tekstur premium"]', 'Aktif'),
('FAB-004', 'Paving', 'paving', 'Bahan jersey ekonomis dengan performa seimbang, pilihan hemat untuk jersey tim dalam jumlah besar.', 35000, '["Harga paling ekonomis", "Cocok untuk tim besar", "Mudah dirawat"]', 'Aktif'),
('FAB-005', 'Dryfit Premium', 'dryfit-premium', 'Bahan jersey dryfit kelas premium dengan daya serap terbaik dan hasil printing paling tajam.', 52000, '["Daya serap keringat terbaik", "Printing ultra tajam", "Material eksklusif"]', 'Aktif');

-- 4. Matriks Skor Bahan (PRD §8)
-- Format: (material_id, criterion_kode, nilai)
INSERT INTO `material_scores` (`material_id`, `criterion_kode`, `nilai`) VALUES
-- Dryfit Milano (FAB-001)
('FAB-001', 'C1', 45000),
('FAB-001', 'C2', 4),
('FAB-001', 'C3', 4),
('FAB-001', 'C4', 4),
('FAB-001', 'C5', 3),
('FAB-001', 'C6', 4),
('FAB-001', 'C7', 4),

-- Benzema (FAB-002)
('FAB-002', 'C1', 40000),
('FAB-002', 'C2', 3),
('FAB-002', 'C3', 4),
('FAB-002', 'C4', 4),
('FAB-002', 'C5', 3),
('FAB-002', 'C6', 4),
('FAB-002', 'C7', 3),

-- Serena (FAB-003)
('FAB-003', 'C1', 38000),
('FAB-003', 'C2', 3),
('FAB-003', 'C3', 3),
('FAB-003', 'C4', 3),
('FAB-003', 'C5', 4),
('FAB-003', 'C6', 3),
('FAB-003', 'C7', 3),

-- Paving (FAB-004)
('FAB-004', 'C1', 35000),
('FAB-004', 'C2', 3),
('FAB-004', 'C3', 3),
('FAB-004', 'C4', 3),
('FAB-004', 'C5', 3),
('FAB-004', 'C6', 3),
('FAB-004', 'C7', 3),

-- Dryfit Premium (FAB-005)
('FAB-005', 'C1', 52000),
('FAB-005', 'C2', 5),
('FAB-005', 'C3', 4),
('FAB-005', 'C4', 5),
('FAB-005', 'C5', 2),
('FAB-005', 'C6', 5),
('FAB-005', 'C7', 5);
