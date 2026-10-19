import app from './app.js'
import { initDatabase } from './db.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT) || 4000

async function startServer() {
  await initDatabase()

  app.listen(PORT, () => {
    console.log(`[API] Server ViaJersey SPK berjalan pada port ${PORT}`)
    console.log(`[API] Endpoint publik: http://localhost:${PORT}/api/materials`)
    console.log(`[API] Healthcheck: http://localhost:${PORT}/api/health`)
  })
}

startServer().catch(err => {
  console.error('[API Startup Error]', err)
  process.exit(1)
})
