import app from './app.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.SPK_PORT || 5001

app.listen(PORT, () => {
  console.log(`[SPK Microservice] Layanan kalkulasi WP berjalan di http://localhost:${PORT}`)
})
