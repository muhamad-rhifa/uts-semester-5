import express from 'express'
import cors from 'cors'
import materialsRouter from './routes/materials.js'
import recommendationsRouter from './routes/recommendations.js'
import adminRouter from './routes/admin.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import { getDatabaseStatus } from './db.js'

const app = express()

// Middlewares dasar
app.use(cors())
app.use(express.json())

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'viajersey-api',
    time: new Date().toISOString(),
    database: getDatabaseStatus(),
  })
})

// Rute API
app.use('/api/materials', materialsRouter)
app.use('/api/recommendations', recommendationsRouter)
app.use('/api/admin', adminRouter)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app
