#!/usr/bin/env bash
# Shell Script Backup Database MySQL — ViaJersey SPK

set -e

DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_NAME="${DB_NAME:-viajersey_spk}"
OUTPUT_DIR="./database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p "$OUTPUT_DIR"
OUTPUT_FILE="$OUTPUT_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"

echo "[Backup] Memulai pencadangan database '$DB_NAME'..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p "$DB_NAME" > "$OUTPUT_FILE"
echo "[Backup Sukses] File tersimpan di: $OUTPUT_FILE"
