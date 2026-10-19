/**
 * wp.ts — Kalkulasi Weighted Product (WP) untuk DEMONSTRASI UI
 *
 * ⚠ PERINGATAN PENTING:
 * Modul ini menghitung WP dari data fixture LOKAL untuk keperluan demo UI Phase 2.
 * BUKAN sumber kebenaran kalkulasi final. Hasil sesungguhnya harus berasal dari
 * backend SPK service yang diverifikasi (Phase 5+).
 *
 * Formula:
 *   w_j dinormalisasi: w_j = bobot_j / Σ bobot
 *   S_i = ∏ (x_ij ^ w_j) — cost: w_j negatif, benefit: w_j positif
 *   V_i = S_i / Σ S_i
 *   Ranking: V_i terbesar → terkecil
 */

export type CriterionType = 'benefit' | 'cost'

export interface Criterion {
  id: string
  type: CriterionType
  weight: number // bobot sebelum dinormalisasi (1–5)
}

export interface AlternativeRow {
  id: string
  values: Record<string, number> // criterion id → nilai
}

export interface WPResult {
  id: string
  S: number
  V: number
  rank: number
}

export interface WPOutput {
  results: WPResult[]
  normalizedWeights: Record<string, number>
  isDemo: true // selalu true — untuk mencegah klaim sebagai hasil produksi
}

/**
 * Validasi bahwa semua nilai yang akan dipangkatkan adalah positif.
 * Sesuai aturan PRD §7: nilai nol/negatif ditolak.
 */
function validatePositive(id: string, criterionId: string, value: number): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `Nilai tidak valid untuk alternatif "${id}" kriteria "${criterionId}": ${value}. Harus positif.`
    )
  }
}

function validateWeight(criterionId: string, weight: number): void {
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error(`Bobot tidak valid untuk kriteria "${criterionId}": ${weight}. Harus positif.`)
  }
}

/**
 * Hitung Weighted Product.
 * @param criteria  - daftar kriteria dengan bobot dan tipe
 * @param alternatives - matriks nilai alternatif
 * @returns WPOutput dengan ranking, nilai S, V, dan bobot ternormalisasi
 */
export function calculateWP(
  criteria: Criterion[],
  alternatives: AlternativeRow[]
): WPOutput {
  if (criteria.length === 0) throw new Error('Minimal 1 kriteria diperlukan.')
  if (alternatives.length === 0) throw new Error('Minimal 1 alternatif diperlukan.')

  // 1. Validasi dan normalisasi bobot
  criteria.forEach(c => validateWeight(c.id, c.weight))
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)
  const normalizedWeights: Record<string, number> = {}
  criteria.forEach(c => {
    normalizedWeights[c.id] = c.weight / totalWeight
  })

  // 2. Hitung S_i untuk setiap alternatif
  const sValues: { id: string; S: number }[] = alternatives.map(alt => {
    let S = 1
    for (const crit of criteria) {
      const xij = alt.values[crit.id]
      if (xij === undefined) {
        throw new Error(`Nilai kriteria "${crit.id}" tidak ditemukan untuk alternatif "${alt.id}".`)
      }
      validatePositive(alt.id, crit.id, xij)
      const w = normalizedWeights[crit.id]
      const exponent = crit.type === 'cost' ? -w : w
      S *= Math.pow(xij, exponent)
    }
    return { id: alt.id, S }
  })

  // 3. Hitung V_i = S_i / Σ S_i
  const totalS = sValues.reduce((sum, { S }) => sum + S, 0)
  if (totalS <= 0) throw new Error('Jumlah nilai S tidak valid (≤ 0).')

  const resultsUnsorted: Omit<WPResult, 'rank'>[] = sValues.map(({ id, S }) => ({
    id,
    S,
    V: S / totalS,
  }))

  // 4. Urutkan descending V_i, assign rank
  const sorted = [...resultsUnsorted].sort((a, b) => b.V - a.V)
  const results: WPResult[] = sorted.map((r, i) => ({ ...r, rank: i + 1 }))

  return { results, normalizedWeights, isDemo: true }
}

/**
 * Buat matriks alternatif dari fixture materials dan preferensi pengguna.
 * C1 (harga) nilainya adalah harga dalam Rupiah (cost).
 * C2-C7 adalah skor 1–5 (benefit, kecuali C5 configurable).
 */
import type { Material } from '../data/fixtures'

export function buildAlternatives(materials: Material[]): AlternativeRow[] {
  return materials.map(m => ({
    id: m.id,
    values: {
      C1: m.hargaDemo,
      C2: m.serapKeringat,
      C3: m.elastisitas,
      C4: m.printing,
      C5: m.ketebalan,
      C6: m.keawetan ?? 3,
      C7: m.quickDry ?? 3,
    },
  }))
}

export interface UserPreferences {
  bobotHarga: number       // C1 (1–5)
  bobotSerap: number       // C2 (1–5)
  bobotElastis: number     // C3 (1–5)
  bobotPrinting: number    // C4 (1–5)
  bobotTebal: number       // C5 (1–5)
  bobotKeawetan: number    // C6 (1–5)
  bobotQuickDry: number    // C7 (1–5)
  anggaranMaks: number | null  // null = tidak dibatasi
  /** Arah C5 — benefit (tebal) atau cost (ringan/tipis) */
  arahC5: CriterionType
}

export function buildCriteria(prefs: UserPreferences): Criterion[] {
  return [
    { id: 'C1', type: 'cost',    weight: prefs.bobotHarga },
    { id: 'C2', type: 'benefit', weight: prefs.bobotSerap },
    { id: 'C3', type: 'benefit', weight: prefs.bobotElastis },
    { id: 'C4', type: 'benefit', weight: prefs.bobotPrinting },
    { id: 'C5', type: prefs.arahC5, weight: prefs.bobotTebal },
    { id: 'C6', type: 'benefit', weight: prefs.bobotKeawetan },
    { id: 'C7', type: 'benefit', weight: prefs.bobotQuickDry },
  ]
}
