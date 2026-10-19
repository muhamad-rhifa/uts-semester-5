import express from 'express'
import cors from 'cors'
import { calculateWeightedProduct } from './wpEngine.js'

const app = express()

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'viajersey-spk-engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

/**
 * POST /calculate
 * Body:
 * {
 *   criteria: [ { id, type, weight } ],
 *   alternatives: [ { id, values: { C1: ..., C2: ... }, meta } ]
 * }
 */
app.post('/calculate', (req, res) => {
  try {
    const { criteria, alternatives } = req.body

    if (!criteria || !alternatives) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Field "criteria" dan "alternatives" wajib dikirim.',
        },
      })
    }

    const output = calculateWeightedProduct(criteria, alternatives)

    res.json({
      success: true,
      data: output,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      error: {
        code: 'WP_CALCULATION_ERROR',
        message: err.message,
      },
    })
  }
})

export default app
