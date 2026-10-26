import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Layers, SlidersHorizontal, ClipboardList, LogOut, Menu, X, Shirt, ExternalLink, User } from 'lucide-react'
import { useAdminData } from '../../context/AdminContext'
import ThemeToggle from '../ui/ThemeToggle'

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bahan', label: 'Bahan Kain', icon: Layers },
  { to: '/admin/kriteria', label: 'Kriteria & Bobot', icon: SlidersHorizontal },
  { to: '/admin/penilaian', label: 'Penilaian', icon: ClipboardList },
]

export default function AdminLayout() {
  const { isAuthenticated, logout, adminUser } = useAdminData()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-dvh flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-dvh w-64 flex flex-col border-r transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        aria-label="Navigasi admin"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 p-5 border-b font-black text-lg" style={{ borderColor: 'var(--color-border)' }}>
          <span className="flex items-center justify-center w-7 h-7 rounded-md" style={{ backgroundColor: 'var(--color-neon)' }}>
            <Shirt size={16} className="text-black" aria-hidden="true" />
          </span>
          <span style={{ color: 'var(--color-text)' }}>
            Via<span style={{ color: 'var(--color-neon)' }}>Jersey</span>{' '}
            <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Admin</span>
          </span>
        </div>

        {/* Tombol kembali ke web utama */}
        <div className="p-3 pb-1">
          <Link
            to="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold border transition-base hover:bg-[rgba(54,217,245,0.12)]"
            style={{
              backgroundColor: 'rgba(54,217,245,0.06)',
              borderColor: 'rgba(54,217,245,0.25)',
              color: 'var(--color-cyan)',
            }}
            title="Kembali ke halaman utama pelanggan"
          >
            <span>← Ke Website Utama</span>
            <ExternalLink size={13} aria-hidden="true" />
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1" aria-label="Menu admin">
          {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-base ${
                  isActive ? 'bg-[rgba(198,255,61,0.1)] text-[var(--color-neon)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User profile, Theme & Logout */}
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
          <ThemeToggle showLabel={true} />

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(198,255,61,0.15)', color: 'var(--color-neon)' }}>
              <User size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                {adminUser?.nama || 'Administrator'}
              </div>
              <div className="text-[11px] truncate" style={{ color: 'var(--color-muted)' }}>
                @{adminUser?.username || 'admin'}
              </div>
            </div>
          </div>

          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-base hover:bg-[rgba(255,100,124,0.1)]"
            style={{ color: 'var(--color-danger)' }}
          >
            <LogOut size={16} aria-hidden="true" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <button
              id="admin-sidebar-toggle"
              className="p-1.5 rounded-lg"
              style={{ color: 'var(--color-muted)' }}
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Buka menu admin"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
            <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
              ViaJersey Admin
            </span>
          </div>

          <ThemeToggle size="sm" />
        </div>

        <main id="admin-main-content" className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
