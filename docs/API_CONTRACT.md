# KONTRAK REST API — ViaJersey SPK

Dokumen ini mendefinisikan kontrak endpoint REST API untuk antarmuka publik dan pengelolaan admin sistem pendukung keputusan rekomendasi bahan jersey custom ViaJersey.

---

## 1. Standar Respons & Error Handling

Semua endpoint menghasilkan respons dalam format JSON dengan format terstandarisasi:

### Format Respons Sukses
```json
{
  "success": true,
  "data": { ... },
  "message": "Opsional: pesan keterangan singkat"
}
```

### Format Respons Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | UNAUTHORIZED | INTERNAL_ERROR",
    "message": "Pesan ramah pengguna",
    "details": [ ... ]
  }
}
```
*Catatan keamanan: Detail teknis internal (stack trace / database internal) tidak dibocorkan ke klien.*

---

## 2. Endpoint Publik (Pelanggan)

### `GET /api/materials`
Mengambil daftar alternatif bahan jersey yang aktif untuk katalog publik.

- **Method:** `GET`
- **Headers:** `Accept: application/json`
- **Query Params (Opsional):**
  - `search`: string pencarian nama/id bahan
  - `max_price`: integer batas anggaran harga demo
- **Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": "FAB-001",
      "nama": "Dryfit Milano",
      "slug": "dryfit-milano",
      "hargaDemo": 45000,
      "serapKeringat": 4,
      "elastisitas": 4,
      "printing": 4,
      "ketebalan": 3,
      "keawetan": 4,
      "quickDry": 4,
      "deskripsi": "Bahan jersey dryfit dengan tekstur milano yang halus...",
      "kelebihan": ["Ringan dan breathable", "Warna cerah tahan lama"],
      "status": "Aktif"
    }
  ]
}
```

### `GET /api/materials/:slugOrId`
Mengambil informasi detail spesifik satu alternatif bahan jersey berdasarkan `slug` atau `id`.

- **Method:** `GET`
- **Response 200 OK:** Data objek bahan tunggal
- **Response 404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Bahan kain tidak ditemukan."
  }
}
```

### `POST /api/recommendations`
Menerima preferensi bobot dan batas anggaran pelanggan, lalu mengembalikan urutan ranking rekomendasi WP (7 Kriteria).

- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "bobotHarga": 3,
  "bobotSerap": 4,
  "bobotElastis": 3,
  "bobotPrinting": 4,
  "bobotTebal": 3,
  "bobotKeawetan": 3,
  "bobotQuickDry": 4,
  "anggaranMaks": 50000,
  "arahC5": "benefit"
}
```
- **Validasi:**
  - `bobot*`: integer 1–5 (opsional, default 3)
  - `anggaranMaks`: integer positif atau null (opsional)
  - `arahC5`: `"benefit"` | `"cost"` (opsional, default konfigurasi admin)
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "rankedMaterials": [
      {
        "id": "FAB-001",
        "rank": 1,
        "V": 0.245,
        "S": 0.00123,
        "material": { ... }
      }
    ],
    "excludedByBudget": [ ... ],
    "normalizedWeights": {
      "C1": 0.125,
      "C2": 0.167,
      "C3": 0.125,
      "C4": 0.167,
      "C5": 0.125,
      "C6": 0.125,
      "C7": 0.167
    },
    "isLiveCalculation": true
  }
}
```

---

## 3. Endpoint Area Admin

Endpoint admin (kecuali login) memerlukan header otentikasi:
`Authorization: Bearer <token_admin>`

### `POST /api/admin/auth/login`
Autentikasi kredensial admin dan menerbitkan token sesi.

- **Method:** `POST`
- **Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_sample",
    "admin": {
      "id": 1,
      "username": "admin",
      "nama": "Administrator ViaJersey"
    }
  }
}
```
- **Response 401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Username atau password salah."
  }
}
```

### `GET /api/admin/dashboard`
Mengambil metrik ringkasan untuk dashboard admin.

- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "totalBahan": 5,
    "kriteriaAktif": 5,
    "kelengkapanPenilaian": 100,
    "arahC5": "benefit",
    "bahanLengkapCount": 5
  }
}
```

### `GET /api/admin/materials` & `POST /api/admin/materials`
- `GET`: Mengambil semua alternatif bahan (termasuk yang non-aktif).
- `POST`: Menambah alternatif bahan baru.

### `PUT /api/admin/materials/:id` & `DELETE /api/admin/materials/:id`
- `PUT`: Mengubah data alternatif bahan.
- `DELETE`: Menghapus alternatif bahan dari database.

### `GET /api/admin/criteria` & `PUT /api/admin/criteria/:kode`
- `GET`: Mengambil daftar 5 kriteria, bobot default, tipe benefit/cost, dan status.
- `PUT`: Memperbarui bobot default kriteria (1–5), tipe, atau arah kriteria C5.

### `GET /api/admin/scores` & `PUT /api/admin/scores/:materialId`
- `GET`: Mengambil matriks nilai karakteristik seluruh bahan.
- `PUT`: Memperbarui skor karakteristik (C1–C5) untuk alternatif tertentu dengan validasi skala 1–5 dan harga &gt; 0.
