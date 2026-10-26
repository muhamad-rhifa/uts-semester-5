import { Shirt, MessageCircle, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      {/* Demo notice */}
      <div
        className="text-center py-2 px-4 text-xs font-semibold"
        style={{
          backgroundColor: 'var(--color-neon-soft)',
          color: 'var(--color-neon)',
          borderBottom: '1px solid var(--color-neon-border)',
        }}
      >
        ⚠ Contoh data untuk pengembangan. Harga dan karakteristik perlu dikonfirmasi ke ViaJersey.
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-black text-lg mb-2">
              <span
                className="flex items-center justify-center w-7 h-7 rounded-md"
                style={{ backgroundColor: 'var(--color-neon)' }}
                aria-hidden="true"
              >
                <Shirt size={16} className="text-black" />
              </span>
              <span style={{ color: 'var(--color-text)' }}>
                Via<span style={{ color: 'var(--color-neon)' }}>Jersey</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              Sistem pendukung keputusan rekomendasi bahan jersey custom. Temukan bahan yang paling sesuai kebutuhanmu.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Navigasi</h3>
            <ul className="space-y-2" style={{ color: 'var(--color-muted)' }}>
              {[
                { href: '/', label: 'Beranda' },
                { href: '/katalog', label: 'Katalog Bahan' },
                { href: '/rekomendasi', label: 'Rekomendasi' },
                { href: '/admin', label: 'Panel Pengelolaan Admin' },
              ].map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-[var(--color-text)] transition-base"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Kontak & Konsultasi</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                <MessageCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  WhatsApp:{' '}
                  <span className="italic" style={{ color: 'var(--color-warning)' }}>
                    dikonfigurasi oleh ViaJersey
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>Lokasi dikonfirmasi oleh ViaJersey</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs"
          style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
        >
          <span>© 2024 ViaJersey. Semua hak dilindungi.</span>
          <span style={{ color: 'var(--color-warning)' }}>
            Harga indikatif — konfirmasi sebelum memesan.
          </span>
        </div>
      </div>
    </footer>
  )
}
