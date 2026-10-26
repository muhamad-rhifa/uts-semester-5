/**
 * whatsapp.ts — Helper untuk link konsultasi WhatsApp
 *
 * Nomor WhatsApp TIDAK di-hardcode. Harus dikonfigurasi oleh ViaJersey.
 * Gunakan environment variable VITE_WA_NUMBER untuk nomor produksi.
 *
 * Format nomor: kode negara tanpa + atau 0 depan (misal: 6281234567890)
 */

const WA_NUMBER = (import.meta.env.VITE_WA_NUMBER as string | undefined)?.trim() || '6281382266367'

/**
 * Cek apakah nomor WhatsApp sudah dikonfigurasi.
 */
export function isWAConfigured(): boolean {
  return Boolean(WA_NUMBER && WA_NUMBER.trim().length > 0)
}

/**
 * Buat URL WhatsApp dengan pesan konsultasi.
 * Mengembalikan null jika nomor belum dikonfigurasi.
 */
export function buildWAUrl(materialName?: string): string | null {
  if (!isWAConfigured()) return null

  const pesan = materialName
    ? `Halo ViaJersey, saya tertarik konsultasi tentang bahan ${materialName}. Boleh info lebih lanjut?`
    : 'Halo ViaJersey, saya ingin konsultasi tentang bahan jersey custom.'

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`
}
