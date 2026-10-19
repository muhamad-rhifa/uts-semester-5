# KONTRAK SPK MICROSERVICE — ViaJersey WP Engine

Dokumen ini mendefinisikan kontrak antarmuka dan spesifikasi matematis layanan independen (*microservice*) Weighted Product (WP) untuk sistem pendukung keputusan rekomendasi bahan jersey custom ViaJersey.

---

## 1. Arsitektur & Spesifikasi Layanan

- **Nama Layanan:** `viajersey-spk-service`
- **Direktori:** `services/spk/`
- **Protokol:** HTTP/JSON REST API
- **Port Default:** `5001` (dikonfigurasi via `SPK_PORT` atau `SPK_SERVICE_URL`)
- **Tanggung Jawab:** Menerima matriks alternatif dan bobot preferensi, memvalidasi integritas data, menghitung normalisasi bobot, vektor preferensi $S_i$ dan nilai relatif $V_i$, serta mengembalikan ranking rekomendasi dengan penanganan kondisi seri yang deterministik.

---

## 2. Rumusan Matematis Weighted Product (WP)

Sesuai `SOT/PRD.md §7`, proses perhitungan terdiri atas 4 tahap:

### Tahap 1: Normalisasi Bobot Kriteria
Total seluruh bobot dihitung:
$$W = \sum_{j=1}^{m} w_j$$

Bobot ternormalisasi untuk setiap kriteria $j$:
$$w_j' = \frac{w_j}{W} \quad \text{sehingga} \quad \sum_{j=1}^{m} w_j' = 1$$

### Tahap 2: Perhitungan Vektor Preferensi ($S_i$)
Setiap alternatif $i$ dihitung nilai vektor $S_i$:
$$S_i = \prod_{j=1}^{m} (x_{ij})^{s_j \cdot w_j'}$$

Keterangan:
- $x_{ij}$: Nilai kinerja alternatif $i$ pada kriteria $j$ (harus bernilai positif $> 0$).
- $s_j = -1$: Jika kriteria $j$ bersifat **Cost** (contoh: C1 Harga).
- $s_j = +1$: Jika kriteria $j$ bersifat **Benefit** (contoh: C2 Serap, C3 Elastis, C4 Printing, C6 Awet, C7 Quick Dry).
- Kriteria C5 (Ketebalan): Ditentukan berdasarkan arah yang disepakati/dikonfigurasi ($+1$ jika *benefit*, $-1$ jika *cost*).

### Tahap 3: Perhitungan Nilai Preferensi Relatif ($V_i$)
Total vektor $S$ dihitung:
$$S_{\text{total}} = \sum_{i=1}^{n} S_i$$

Nilai preferensi relatif $V_i$ untuk alternatif $i$:
$$V_i = \frac{S_i}{S_{\text{total}}} \quad \text{sehingga} \quad \sum_{i=1}^{n} V_i = 1.0 \text{ (100\%)}$$

### Tahap 4: Pemeringkatan (Ranking)
Alternatif diurutkan dari nilai $V_i$ tertinggi ke terendah. Jika terjadi nilai $V_i$ sama (*tie condition*), sistem menggunakan pengurutan deterministik berdasarkan ID alternatif untuk memastikan stabilitas hasil.

---

## 3. Spesifikasi Endpoint

### `GET /health`
Mengecek status ketersediaan layanan SPK.

- **Method:** `GET`
- **Response 200 OK:**
```json
{
  "status": "ok",
  "service": "viajersey-spk-engine",
  "version": "1.0.0",
  "timestamp": "2026-10-19T16:45:00.000Z"
}
```

---

### `POST /calculate`
Menghitung rekomendasi Weighted Product berdasarkan kriteria dan alternatif yang dikirim.

- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "criteria": [
    { "id": "C1", "type": "cost", "weight": 5 },
    { "id": "C2", "type": "benefit", "weight": 4 },
    { "id": "C3", "type": "benefit", "weight": 3 },
    { "id": "C4", "type": "benefit", "weight": 4 },
    { "id": "C5", "type": "benefit", "weight": 3 },
    { "id": "C6", "type": "benefit", "weight": 3 },
    { "id": "C7", "type": "benefit", "weight": 4 }
  ],
  "alternatives": [
    {
      "id": "FAB-001",
      "values": {
        "C1": 45000,
        "C2": 4,
        "C3": 4,
        "C4": 4,
        "C5": 3,
        "C6": 4,
        "C7": 4
      },
      "meta": { "nama": "Dryfit Milano" }
    }
  ]
}
```

- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "normalizedWeights": {
      "C1": 0.1923,
      "C2": 0.1538,
      "C3": 0.1154,
      "C4": 0.1538,
      "C5": 0.1154,
      "C6": 0.1154,
      "C7": 0.1538
    },
    "results": [
      {
        "id": "FAB-001",
        "rank": 1,
        "S": 0.0012345,
        "V": 0.3542,
        "meta": { "nama": "Dryfit Milano" }
      }
    ],
    "totalS": 0.003485,
    "isCalculatedByMicroservice": true
  }
}
```

- **Response 400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "WP_CALCULATION_ERROR",
    "message": "Nilai C1 pada alternatif FAB-001 harus berupa angka positif > 0 (diterima: 0)."
  }
}
```

---

## 4. Benchmark Perhitungan Manual (Ground Truth Verification)

Skenario acuan untuk validasi kebenaran matematis:
- **Kriteria:**
  - $C_1$ (*Cost*), Bobot $W_1 = 2 \rightarrow w_1' = 2 / 4 = 0.5$ (eksponen: $-0.5$)
  - $C_2$ (*Benefit*), Bobot $W_2 = 2 \rightarrow w_2' = 2 / 4 = 0.5$ (eksponen: $+0.5$)
- **Alternatif:**
  - $A_1$: $C_1 = 4, C_2 = 9$
    $$S_1 = 4^{-0.5} \times 9^{0.5} = \frac{1}{2} \times 3 = 1.5$$
  - $A_2$: $C_1 = 16, C_2 = 4$
    $$S_2 = 16^{-0.5} \times 4^{0.5} = \frac{1}{4} \times 2 = 0.5$$
- **Hasil Agregasi:**
  - $S_{\text{total}} = 1.5 + 0.5 = 2.0$
  - $V_1 = 1.5 / 2.0 = 0.75$ (**Peringkat 1**)
  - $V_2 = 0.5 / 2.0 = 0.25$ (**Peringkat 2**)

Pengujian unit otomatis (`services/spk/src/wp.test.js`) memverifikasi skenario ini dengan toleransi presisi floating-point $< 10^{-9}$.
