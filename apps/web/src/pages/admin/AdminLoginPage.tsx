import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, AlertCircle, KeyRound, ArrowLeft, Loader2 } from 'lucide-react'
import { useAdminData } from '../../context/AdminContext'
import Button from '../../components/ui/Button'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAdminData()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Jika sudah terotentikasi, otomatis redirect ke dashboard admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.')
      return
    }

    setLoading(true)
    const res = await login(username, password)
    setLoading(false)

    if (res.success) {
      navigate('/admin/dashboard')
    } else {
      setError(res.message || 'Login gagal. Periksa kembali username dan password.')
    }
  }

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-md">
        {/* Navigasi kembali */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-base hover:text-[var(--color-neon)]"
            style={{ color: 'var(--color-muted)' }}
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Card */}
        <div className="card-base p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 border"
              style={{ backgroundColor: 'var(--color-neon-soft)', borderColor: 'var(--color-neon-border)' }}
              aria-hidden="true"
            >
              <LogIn size={22} style={{ color: 'var(--color-neon)' }} />
            </div>
            <h1 className="text-xl font-black" style={{ color: 'var(--color-text)' }}>
              Login Administrator
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
              ViaJersey SPK — Panel Manajemen Data & Kriteria
            </p>
          </div>

          {/* Kredensial Akun Info */}
          <div
            className="rounded-xl border p-3.5 mb-5 text-xs"
            style={{ backgroundColor: 'var(--color-neon-soft)', borderColor: 'var(--color-neon-border)' }}
            role="note"
          >
            <div className="flex items-center gap-1.5 font-bold mb-1.5" style={{ color: 'var(--color-neon)' }}>
              <KeyRound size={14} /> Kredensial Akun Administrator:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--color-muted)' }}>Username</span>
                <code className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>admin</code>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--color-muted)' }}>Password</span>
                <code className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>admin123</code>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl border p-3 mb-4 flex items-center gap-2 text-xs"
              style={{ backgroundColor: 'rgba(255,100,124,0.08)', borderColor: 'rgba(255,100,124,0.3)', color: 'var(--color-danger)' }}
              role="alert"
              aria-live="polite"
            >
              <AlertCircle size={15} aria-hidden="true" className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} aria-label="Form login admin" noValidate>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="admin-username" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text)' }}>
                  Username Administrator
                </label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border bg-transparent transition-base focus:border-[var(--color-neon)] outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-surface-raised)',
                  }}
                  placeholder="Masukkan username"
                  aria-required="true"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text)' }}>
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border bg-transparent transition-base focus:border-[var(--color-neon)] outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-surface-raised)',
                  }}
                  placeholder="Masukkan password"
                  aria-required="true"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                id="btn-admin-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <LogIn size={17} aria-hidden="true" />
                    Masuk ke Panel Admin
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-muted)' }}>
          ViaJersey SPK — Sistem Pendukung Keputusan Pemilihan Bahan Kain Jersey
        </p>
      </div>
    </div>
  )
}
