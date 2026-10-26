import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Shirt, MessageCircle, ShieldCheck } from 'lucide-react'
import { buildWAUrl } from '../../lib/whatsapp'

const NAV_LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/katalog', label: 'Katalog Bahan' },
  { to: '/rekomendasi', label: 'Rekomendasi' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const waUrl = buildWAUrl()

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(8,11,18,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 font-black text-xl tracking-tight"
            style={{ color: 'var(--color-text)' }}
            aria-label="ViaJersey - Halaman Beranda"
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ backgroundColor: 'var(--color-neon)' }}
              aria-hidden="true"
            >
              <Shirt size={18} className="text-black" />
            </span>
            <span>
              Via<span style={{ color: 'var(--color-neon)' }}>Jersey</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-base"
                style={{
                  color: isActive(link.to) ? 'var(--color-neon)' : 'var(--color-muted)',
                  backgroundColor: isActive(link.to) ? 'rgba(198,255,61,0.08)' : 'transparent',
                }}
                aria-current={isActive(link.to) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-base"
                style={{ backgroundColor: 'var(--color-neon)', color: '#0a0a0a' }}
                aria-label="Konsultasi via WhatsApp"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Konsultasi
              </a>
            ) : (
              <button
                disabled
                className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-muted)' }}
                title="Nomor WhatsApp belum dikonfigurasi"
                aria-label="Konsultasi via WhatsApp (belum dikonfigurasi)"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Konsultasi
              </button>
            )}
            <Link
              to="/admin/dashboard"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-base hover:border-[var(--color-neon)]"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
              }}
              title="Masuk ke Panel Pengelolaan Admin"
            >
              <ShieldCheck size={15} style={{ color: 'var(--color-neon)' }} aria-hidden="true" />
              Panel Admin
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg transition-base"
            style={{ color: 'var(--color-muted)' }}
            onClick={() => setMenuOpen(v => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navigasi mobile"
          className="md:hidden border-t px-4 py-3 space-y-1"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-base"
              style={{
                color: isActive(link.to) ? 'var(--color-neon)' : 'var(--color-muted)',
                backgroundColor: isActive(link.to) ? 'rgba(198,255,61,0.08)' : 'transparent',
              }}
              aria-current={isActive(link.to) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-1 space-y-1.5">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: 'var(--color-neon)', color: '#0a0a0a' }}
                onClick={() => setMenuOpen(false)}
                aria-label="Konsultasi via WhatsApp"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Konsultasi WhatsApp
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-muted)' }}
                title="Nomor WhatsApp belum dikonfigurasi"
                aria-label="Konsultasi via WhatsApp (belum dikonfigurasi)"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Konsultasi WhatsApp
              </button>
            )}
            <Link
              to="/admin/dashboard"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-xs font-bold border transition-base"
              style={{
                borderColor: 'rgba(54,217,245,0.3)',
                backgroundColor: 'rgba(54,217,245,0.06)',
                color: 'var(--color-cyan)',
              }}
              onClick={() => setMenuOpen(false)}
            >
              <ShieldCheck size={15} aria-hidden="true" />
              Masuk ke Panel Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
