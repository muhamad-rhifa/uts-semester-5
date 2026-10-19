import { Router } from 'express'
import { getMaterials, getMaterialByIdOrSlug } from '../db.js'

const router = Router()

/**
 * GET /api/materials
 * Mengambil daftar seluruh alternatif bahan yang aktif untuk katalog publik
 */
router.get('/', async (req, res, next) => {
  try {
    let list = await getMaterials(true)

    // Filter pencarian opsional
    if (req.query.search) {
      const q = req.query.search.toLowerCase()
      list = list.filter(
        m => m.nama.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
      )
    }

    // Filter batas harga opsional
    if (req.query.max_price) {
      const maxPrice = Number(req.query.max_price)
      if (!isNaN(maxPrice) && maxPrice > 0) {
        list = list.filter(m => m.hargaDemo <= maxPrice)
      }
    }

    res.json({
      success: true,
      data: list,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/materials/:slugOrId
 * Mengambil detail satu bahan berdasarkan slug atau ID
 */
router.get('/:slugOrId', async (req, res, next) => {
  try {
    const { slugOrId } = req.params
    const material = await getMaterialByIdOrSlug(slugOrId)

    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bahan dengan ID/slug '${slugOrId}' tidak ditemukan.`,
        },
      })
    }

    res.json({
      success: true,
      data: material,
    })
  } catch (err) {
    next(err)
  }
})

export default router
