import { Router } from 'express'
import { getMaterials, getCriteria } from '../db.js'

const router = Router()

/**
 * Validasi dan perhitungan Weighted Product di backend API
 */
function calculateWeightedProduct(criteriaConfigs, materials, weights) {
  // 1. Normalisasi bobot
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  if (totalWeight <= 0) {
    throw new Error('Total bobot preferensi harus lebih besar dari 0.')
  }

  const normalizedWeights = {}
  for (const [k, w] of Object.entries(weights)) {
    normalizedWeights[k] = w / totalWeight
  }

  // 2. Hitung S_i
  const sList = materials.map(m => {
    let S = 1

    // C1: Harga (Cost -> pangkat negatif)
    if (m.hargaDemo <= 0) throw new Error(`Harga bahan ${m.id} tidak valid (harus > 0).`)
    S *= Math.pow(m.hargaDemo, -normalizedWeights.C1)

    // C2: Serap (Benefit)
    if (m.serapKeringat <= 0) throw new Error(`Skor serap bahan ${m.id} harus > 0.`)
    S *= Math.pow(m.serapKeringat, normalizedWeights.C2)

    // C3: Elastis (Benefit)
    if (m.elastisitas <= 0) throw new Error(`Skor elastisitas bahan ${m.id} harus > 0.`)
    S *= Math.pow(m.elastisitas, normalizedWeights.C3)

    // C4: Printing (Benefit)
    if (m.printing <= 0) throw new Error(`Skor printing bahan ${m.id} harus > 0.`)
    S *= Math.pow(m.printing, normalizedWeights.C4)

    // C5: Ketebalan (Arah kriteria ditentukan: benefit atau cost)
    if (m.ketebalan <= 0) throw new Error(`Skor ketebalan bahan ${m.id} harus > 0.`)
    const expC5 = criteriaConfigs.C5?.tipe === 'cost' ? -normalizedWeights.C5 : normalizedWeights.C5
    S *= Math.pow(m.ketebalan, expC5)

    // C6: Keawetan (Benefit)
    if (m.keawetan <= 0) throw new Error(`Skor keawetan bahan ${m.id} harus > 0.`)
    S *= Math.pow(m.keawetan, normalizedWeights.C6)

    // C7: Quick Dry (Benefit)
    if (m.quickDry <= 0) throw new Error(`Skor quick dry bahan ${m.id} harus > 0.`)
    S *= Math.pow(m.quickDry, normalizedWeights.C7)

    return { id: m.id, S, material: m }
  })

  // 3. Hitung V_i = S_i / sum(S)
  const totalS = sList.reduce((sum, item) => sum + item.S, 0)
  if (totalS <= 0) throw new Error('Total nilai S tidak valid (<= 0).')

  const ranked = sList
    .map(item => ({
      id: item.id,
      S: item.S,
      V: item.S / totalS,
      material: item.material,
    }))
    .sort((a, b) => b.V - a.V)
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }))

  return { ranked, normalizedWeights }
}

/**
 * POST /api/recommendations
 * Menerima input preferensi dan mengembalikan hasil ranking rekomendasi
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      bobotHarga = 3,
      bobotSerap = 3,
      bobotElastis = 3,
      bobotPrinting = 3,
      bobotTebal = 3,
      bobotKeawetan = 3,
      bobotQuickDry = 3,
      anggaranMaks = null,
      arahC5 = null,
    } = req.body

    // Validasi bobot 1-5
    const weights = {
      C1: Number(bobotHarga),
      C2: Number(bobotSerap),
      C3: Number(bobotElastis),
      C4: Number(bobotPrinting),
      C5: Number(bobotTebal),
      C6: Number(bobotKeawetan),
      C7: Number(bobotQuickDry),
    }

    for (const [k, w] of Object.entries(weights)) {
      if (isNaN(w) || w < 1 || w > 5) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Bobot kriteria ${k} harus berupa angka antara 1 dan 5.`,
          },
        })
      }
    }

    // Validasi anggaran (jika ada)
    let budgetLimit = null
    if (anggaranMaks !== null && anggaranMaks !== undefined && anggaranMaks !== '') {
      budgetLimit = Number(anggaranMaks)
      if (isNaN(budgetLimit) || budgetLimit <= 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Anggaran maksimum harus berupa angka positif.',
          },
        })
      }
    }

    const allMaterials = await getMaterials(true)
    const criteriaList = await getCriteria()

    const criteriaConfigs = {}
    criteriaList.forEach(c => {
      criteriaConfigs[c.kode] = c
    })

    // Jika pengguna / request menentukan arah C5 spesifik, gunakan itu
    if (arahC5 === 'benefit' || arahC5 === 'cost') {
      criteriaConfigs.C5 = {
        ...criteriaConfigs.C5,
        tipe: arahC5,
      }
    }

    // Filter bahan berdasarkan anggaran
    let candidates = allMaterials
    let excluded = []

    if (budgetLimit !== null) {
      candidates = allMaterials.filter(m => m.hargaDemo <= budgetLimit)
      excluded = allMaterials.filter(m => m.hargaDemo > budgetLimit)
    }

    // Jika tidak ada alternatif yang masuk anggaran, kembalikan daftar kosong beserta bahan di luar anggaran
    if (candidates.length === 0) {
      return res.json({
        success: true,
        data: {
          rankedMaterials: [],
          excludedByBudget: excluded,
          message: 'Belum ada bahan yang masuk batas anggaran ini.',
          normalizedWeights: {},
          isCalculationLive: true,
        },
      })
    }

    // Coba delegasikan ke SPK Microservice independen (Phase 5)
    const spkServiceUrl = process.env.SPK_SERVICE_URL || 'http://localhost:5001'
    let ranked = null
    let normalizedWeights = null
    let calculatedByMicroservice = false

    try {
      const spkPayload = {
        criteria: Object.entries(weights).map(([id, weight]) => ({
          id,
          weight,
          type: criteriaConfigs[id]?.tipe || 'benefit',
        })),
        alternatives: candidates.map(m => ({
          id: m.id,
          values: {
            C1: m.hargaDemo,
            C2: m.serapKeringat,
            C3: m.elastisitas,
            C4: m.printing,
            C5: m.ketebalan,
            C6: m.keawetan,
            C7: m.quickDry,
          },
          meta: m,
        })),
      }

      const spkRes = await fetch(`${spkServiceUrl}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spkPayload),
        signal: AbortSignal.timeout(1500),
      })

      if (spkRes.ok) {
        const spkJson = await spkRes.json()
        if (spkJson.success && spkJson.data) {
          ranked = spkJson.data.results.map(r => ({
            id: r.id,
            rank: r.rank,
            S: r.S,
            V: r.V,
            material: r.meta,
          }))
          normalizedWeights = spkJson.data.normalizedWeights
          calculatedByMicroservice = true
        }
      }
    } catch {
      // In-process fallback jika service SPK offline
    }

    if (!ranked) {
      const localResult = calculateWeightedProduct(
        criteriaConfigs,
        candidates,
        weights
      )
      ranked = localResult.ranked
      normalizedWeights = localResult.normalizedWeights
    }

    res.json({
      success: true,
      data: {
        rankedMaterials: ranked,
        excludedByBudget: excluded,
        normalizedWeights,
        criteriaUsed: criteriaConfigs,
        isCalculationLive: true,
        isCalculatedByMicroservice: calculatedByMicroservice,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
