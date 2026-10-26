import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AdminProvider } from './context/AdminContext'
import PublicLayout from './components/layout/PublicLayout'
import BerandaPage from './pages/BerandaPage'
import KatalogPage from './pages/KatalogPage'
import DetailBahanPage from './pages/DetailBahanPage'
import RekomendasiPage from './pages/RekomendasiPage'
import HasilRekomendasiPage from './pages/HasilRekomendasiPage'
import PerbandinganPage from './pages/PerbandinganPage'
import AdminLayout from './components/layout/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminBahanPage from './pages/admin/AdminBahanPage'
import AdminKriteriaPage from './pages/admin/AdminKriteriaPage'
import AdminPenilaianPage from './pages/admin/AdminPenilaianPage'

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <BrowserRouter>
        <Routes>
        {/* Area publik */}
        <Route element={<PublicLayout />}>
          <Route index element={<BerandaPage />} />
          <Route path="katalog" element={<KatalogPage />} />
          <Route path="katalog/:slug" element={<DetailBahanPage />} />
          <Route path="rekomendasi" element={<RekomendasiPage />} />
          <Route path="rekomendasi/hasil" element={<HasilRekomendasiPage />} />
          <Route path="perbandingan" element={<PerbandinganPage />} />
        </Route>

        {/* Login admin — layout tersendiri */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Area admin */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="bahan" element={<AdminBahanPage />} />
          <Route path="kriteria" element={<AdminKriteriaPage />} />
          <Route path="penilaian" element={<AdminPenilaianPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AdminProvider>
    </ThemeProvider>
  )
}
