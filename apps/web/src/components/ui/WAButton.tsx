import { MessageCircle } from 'lucide-react'
import { buildWAUrl, isWAConfigured } from '../../lib/whatsapp'

interface WAButtonProps {
  materialName?: string
  className?: string
  size?: 'sm' | 'md'
  id?: string
}

/**
 * Tombol konsultasi WhatsApp.
 * Jika nomor belum dikonfigurasi (VITE_WA_NUMBER kosong), tombol tampil
 * disabled dengan tooltip penjelasan — tidak pura-pura aktif.
 */
export default function WAButton({ materialName, className = '', size = 'md', id }: WAButtonProps) {
  const url = buildWAUrl(materialName)
  const configured = isWAConfigured()

  const sizeStyle = size === 'sm'
    ? 'px-3 py-1.5 text-xs rounded-lg'
    : 'px-4 py-2 text-sm rounded-xl'

  if (!configured || !url) {
    return (
      <button
        id={id}
        disabled
        aria-disabled="true"
        className={`inline-flex items-center justify-center gap-2 font-medium border opacity-50 cursor-not-allowed ${sizeStyle} ${className}`}
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)', backgroundColor: 'var(--color-surface-raised)' }}
        title="Nomor WhatsApp belum dikonfigurasi oleh ViaJersey"
        aria-label="Konsultasi WhatsApp (belum dikonfigurasi)"
      >
        <MessageCircle size={size === 'sm' ? 13 : 15} aria-hidden="true" />
        Konsultasi WhatsApp
      </button>
    )
  }

  return (
    <a
      id={id}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-semibold border transition-base ${sizeStyle} ${className}`}
      style={{ borderColor: 'rgba(54,217,245,0.4)', color: 'var(--color-cyan)', backgroundColor: 'rgba(54,217,245,0.06)' }}
      aria-label={materialName ? `Konsultasi WhatsApp tentang bahan ${materialName}` : 'Konsultasi WhatsApp ViaJersey'}
    >
      <MessageCircle size={size === 'sm' ? 13 : 15} aria-hidden="true" />
      Konsultasi WhatsApp
    </a>
  )
}
