/**
 * ENGINE KALKULASI WEIGHTED PRODUCT (WP) INDEPENDEN
 * Sesuai SOT/PRD.md §7 & IMPLEMENTATION_PLAN.md Phase 5
 * 
 * Formula:
 * 1. Normalisasi Bobot:
 *    w_j = W_j / \sum_{k=1}^m W_k
 * 2. Vektor Preferensi Si:
 *    S_i = \prod_{j=1}^m (x_{ij})^{s_j \cdot w_j}
 *    di mana s_j = -1 untuk kriteria Cost, dan +1 untuk Benefit.
 * 3. Nilai Relatif Vi:
 *    V_i = S_i / \sum_{k=1}^n S_k
 * 4. Peringkat:
 *    Diurutkan dari nilai V_i terbesar ke terkecil.
 */

/**
 * Validasi dan perhitungan Weighted Product
 * @param {Array<{ id: string, type: 'benefit' | 'cost', weight: number }>} criteria
 * @param {Array<{ id: string, values: Record<string, number>, meta?: any }>} alternatives
 * @returns {{
 *   normalizedWeights: Record<string, number>,
 *   results: Array<{ id: string, S: number, V: number, rank: number, meta?: any }>,
 *   totalS: number,
 *   isCalculatedByMicroservice: boolean
 * }}
 */
export function calculateWeightedProduct(criteria, alternatives) {
  // 1. Validasi input dasar
  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error('Daftar kriteria harus berupa array dan tidak boleh kosong.')
  }
  if (!Array.isArray(alternatives) || alternatives.length === 0) {
    throw new Error('Daftar alternatif harus berupa array dan tidak boleh kosong.')
  }

  // 2. Validasi kriteria & hitung total bobot
  let totalWeight = 0
  for (const c of criteria) {
    if (!c.id) throw new Error('Setiap kriteria harus memiliki identifier unik (id/kode).')
    if (c.type !== 'benefit' && c.type !== 'cost') {
      throw new Error(`Tipe kriteria ${c.id} tidak valid ('${c.type}'). Harus 'benefit' atau 'cost'.`)
    }
    const w = Number(c.weight)
    if (isNaN(w) || w <= 0) {
      throw new Error(`Bobot kriteria ${c.id} harus berupa angka positif lebih dari 0 (diterima: ${c.weight}).`)
    }
    totalWeight += w
  }

  if (totalWeight <= 0) {
    throw new Error('Total bobot kriteria harus lebih besar dari 0.')
  }

  // 3. Normalisasi bobot (sum = 1.0)
  const normalizedWeights = {}
  for (const c of criteria) {
    normalizedWeights[c.id] = Number(c.weight) / totalWeight
  }

  // 4. Hitung Vektor S_i untuk setiap alternatif
  const sList = alternatives.map(alt => {
    if (!alt.id) throw new Error('Setiap alternatif harus memiliki identifier unik (id).')
    if (!alt.values || typeof alt.values !== 'object') {
      throw new Error(`Data matriks nilai alternatif ${alt.id} tidak valid.`)
    }

    let S = 1.0

    for (const c of criteria) {
      const val = alt.values[c.id]
      if (val === undefined || val === null) {
        throw new Error(`Nilai kriteria ${c.id} tidak ditemukan pada alternatif ${alt.id}.`)
      }
      const numVal = Number(val)
      if (isNaN(numVal) || numVal <= 0) {
        throw new Error(`Nilai ${c.id} pada alternatif ${alt.id} harus berupa angka positif > 0 (diterima: ${val}).`)
      }

      const normW = normalizedWeights[c.id]
      const exponent = c.type === 'cost' ? -normW : normW
      S *= Math.pow(numVal, exponent)
    }

    return {
      id: alt.id,
      S,
      meta: alt.meta || null,
    }
  })

  // 5. Hitung total S dan nilai preferensi relatif V_i
  const totalS = sList.reduce((acc, item) => acc + item.S, 0)
  if (totalS <= 0 || isNaN(totalS) || !isFinite(totalS)) {
    throw new Error('Total nilai vektor S tidak valid (harus angka terhingga > 0).')
  }

  // 6. Urutkan berdasarkan V_i tertinggi ke terendah (stabil untuk tie-break)
  const results = sList
    .map(item => ({
      id: item.id,
      S: item.S,
      V: item.S / totalS,
      meta: item.meta,
    }))
    .sort((a, b) => {
      if (b.V !== a.V) return b.V - a.V
      return a.id.localeCompare(b.id) // Penanganan seri deterministik
    })
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }))

  return {
    normalizedWeights,
    results,
    totalS,
    isCalculatedByMicroservice: true,
  }
}
