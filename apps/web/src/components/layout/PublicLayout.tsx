import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
