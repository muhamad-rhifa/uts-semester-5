import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, AlertCircle, Info } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Phase 1: tidak ada autentikasi nyata — hanya validasi field kosong
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.')
      return
    }

    // Menuju dashboard sebagai mock — belum ada autentikasi sesungguhnya
    navigate('/admin/dashboard')
  }

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
              style={{ backgroundColor: 'rgba(198,255,61,0.1)', border: '1px solid rgba(198,255,61,0.2)' }}
              aria-hidden="true"
            >
              <LogIn size={22} style={{ color: 'var(--color-neon)' }} />
            </div>
            <h1 className="text-xl font-black" style={{ color: 'var(--color-text)' }}>
              Login Admin
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
              ViaJersey — Panel Pengelolaan
            </p>
          </div>

          {/* Mock notice */}
          <div
            className="rounded-xl border p-3 mb-5 flex items-start gap-2 text-xs"
            style={{ backgroundColor: 'rgba(54,217,245,0.06)', borderColor: 'rgba(54,217,245,0.2)', color: 'var(--color-cyan)' }}
            role="note"
          >
            <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Mock Phase 3</strong> — Autentikasi sesi dikelola di sisi frontend untuk evaluasi UI. Autentikasi backend sesungguhnya aktif pada Phase 4. Masukkan username/password bebas untuk mencoba demo.
            </span>
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl border p-3 mb-4 flex items-center gap-2 text-sm"
              style={{ backgroundColor: 'rgba(255,100,124,0.08)', borderColor: 'rgba(255,100,124,0.3)', color: 'var(--color-danger)' }}
              role="alert"
              aria-live="polite"
            >
              <AlertCircle size={15} aria-hidden="true" className="shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} aria-label="Form login admin" noValidate>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="admin-username" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                  Username / Email
                </label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border bg-transparent transition-base"
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
                <label htmlFor="admin-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border bg-transparent transition-base"
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
              >
                <LogIn size={17} aria-hidden="true" />
                Masuk
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-muted)' }}>
          Lupa akses? Hubungi administrator ViaJersey.
        </p>
      </div>
    </div>
  )
}
