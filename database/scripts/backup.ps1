# PowerShell Database Backup Script — ViaJersey SPK
param(
    [string]$HostName = "localhost",
    [string]$UserName = "root",
    [string]$Database = "viajersey_spk",
    [string]$OutputDir = "./database/backups"
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
if (!(Test-Path -Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$outputFile = Join-Path $OutputDir "backup_${Database}_${timestamp}.sql"

Write-Host "[Backup] Memulai pencadangan database ${Database} ke ${outputFile}..." -ForegroundColor Cyan

try {
    & mysqldump -h $HostName -u $UserName -p $Database > $outputFile
    Write-Host "[Backup] Pencadangan selesai: ${outputFile}" -ForegroundColor Green
} catch {
    Write-Host "[Backup Error] Gagal melakukan backup: $_" -ForegroundColor Red
}
