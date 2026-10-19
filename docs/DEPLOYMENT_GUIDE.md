# PANDUAN DEPLOYMENT & OPERASIONAL — ViaJersey SPK

Dokumen ini adalah panduan resmi penerapan (*deployment*), konfigurasi domain, HTTPS, pemeliharaan basis data, dan pemantauan sistem pendukung keputusan rekomendasi bahan jersey custom ViaJersey (Phase 7).

---

## 1. Arsitektur Produksi

Sistem ViaJersey SPK beroperasi menggunakan arsitektur monorepo modular:
1. **Frontend (`apps/web`):** Single Page Application (React 19 + Vite + Tailwind CSS). Di-build ke aset statis dan dilayani via Nginx / Vercel / Netlify.
2. **Backend API (`services/api`):** Node.js Express REST API (Port 4000). Mengelola autentikasi admin, CRUD master data bahan & kriteria, serta endpoint rekomendasi.
3. **SPK Microservice (`services/spk`):** Layanan kalkulasi independen Weighted Product (Port 5001).
4. **Database (`MySQL 8.0+`):** Menyimpan master data bahan, 7 kriteria, matriks skor, dan data admin.

---

## 2. Opsi Penerapan (Deployment Options)

### Opsi A: Deployment Terpadu dengan Docker Compose (Direkomendasikan untuk VPS)

Docker Compose menyalakan MySQL, SPK Microservice, Backend API, dan Frontend Nginx hanya dengan satu perintah.

1. **Persiapan Server:**
   - Pasang Docker dan Docker Compose di server VPS (Ubuntu 22.04 / 24.04).
   - Clone repositori ke server:
     ```bash
     git clone <url-repo> /opt/viajersey
     cd /opt/viajersey
     ```
2. **Konfigurasi Environment:**
   - Salin `.env.example` ke `.env` dan perbarui password aman:
     ```bash
     cp .env.example .env
     ```
3. **Build dan Jalankan Seluruh Container:**
     ```bash
     docker compose up -d --build
     ```
4. **Verifikasi Layanan Berjalan:**
     ```bash
     docker compose ps
     ```
   Semua container (`viajersey-mysql`, `viajersey-spk`, `viajersey-api`, `viajersey-web`) akan berstatus *Up / Healthy*.

---

### Opsi B: Deployment Manual dengan Node.js & PM2 (Standar VPS / Server Tradisional)

1. **Frontend:**
   ```bash
   cd apps/web
   npm install
   npm run build
   # Hasil build di folder dist/ dilayani menggunakan Nginx web server
   ```

2. **SPK Microservice:**
   ```bash
   cd services/spk
   npm install --production
   pm2 start src/server.js --name "viajersey-spk" --env SPK_PORT=5001
   ```

3. **Backend REST API:**
   ```bash
   cd services/api
   npm install --production
   pm2 start src/server.js --name "viajersey-api" --env PORT=4000
   ```

4. **Simpan Konfigurasi PM2:**
   ```bash
   pm2 save
   pm2 startup
   ```

---

## 3. Konfigurasi Domain, Reverse Proxy Nginx & SSL HTTPS

Berikut contoh konfigurasi Nginx pada `/etc/nginx/sites-available/viajersey.conf`:

```nginx
server {
    listen 80;
    server_name viajersey.com www.viajersey.com spk.viajersey.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name viajersey.com www.viajersey.com;

    ssl_certificate /etc/letsencrypt/live/viajersey.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viajersey.com/privkey.pem;

    root /opt/viajersey/apps/web/dist;
    index index.html;

    # Frontend SPA Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy ke Backend REST API
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Memasang Sertifikat SSL Gratis (Certbot):
```bash
sudo certbot --nginx -d viajersey.com -d www.viajersey.com
```

---

## 4. Pencadangan & Pemulihan Basis Data (Backup & Recovery)

### Pencadangan Manual:
- **Linux/macOS:**
  ```bash
  bash database/scripts/backup.sh
  ```
- **Windows PowerShell:**
  ```powershell
  .\database\scripts\backup.ps1
  ```

### Otomatisasi Backup Harian (Linux Cron Job):
Tambahkan perintah ini pada `crontab -e` untuk mencadangkan database setiap pukul 02:00 pagi:
```cron
0 2 * * * /opt/viajersey/database/scripts/backup.sh > /dev/null 2>&1
```

### Pemulihan (Restore):
```bash
mysql -u <username> -p viajersey_spk < ./database/backups/backup_viajersey_spk_YYYYMMDD_HHMMSS.sql
```

---

## 5. Pemantauan & Health Checks

Endpoints health check tersedia untuk integrasi dengan monitoring (misal: UptimeKuma / Prometheus / Datadog):
- **Backend API:** `GET http://localhost:4000/api/health`
- **SPK Microservice:** `GET http://localhost:5001/health`
- **Frontend Nginx:** `GET http://localhost:80/`
