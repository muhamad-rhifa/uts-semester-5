/**
 * API Client & Adapter Service — Phase 6 Integrasi
 * Menghubungkan antarmuka frontend dengan Backend REST API & SPK Microservice
 * dengan graceful fallback ke engine lokal jika backend sedang tidak dijalankan.
 */

import type { Material } from '../data/fixtures'
import type { UserPreferences } from '../lib/wp'
import { calculateWP, buildAlternatives, buildCriteria } from '../lib/wp'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export interface RecommendationResponse {
  rankedMaterials: Array<{
    id: string
    rank: number
    S: number
    V: number
    material: Material
  }>
  excludedByBudget: Material[]
  normalizedWeights: Record<string, number>
  isCalculationLive: boolean
  isCalculatedByMicroservice?: boolean
  source: 'backend_api' | 'spk_microservice' | 'local_engine_fallback'
}

/**
 * Cek ketersediaan server backend
 */
export async function checkBackendHealth(): Promise<{ online: boolean; database?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(1200),
    })
    if (res.ok) {
      const data = await res.json()
      return { online: true, database: data.database?.provider }
    }
  } catch {
    // Offline
  }
  return { online: false }
}

/**
 * Jalankan kalkulasi rekomendasi:
 * 1. Prioritaskan panggilan ke Backend REST API -> SPK Microservice
 * 2. Jika Backend offline, fallback ke engine lokal (client-side WP)
 */
export async function calculateRecommendation(
  prefs: UserPreferences,
  fallbackMaterials: Material[]
): Promise<RecommendationResponse> {
  // 1. Coba panggil Backend API
  try {
    const payload = {
      bobotHarga: prefs.bobotHarga,
      bobotSerap: prefs.bobotSerap,
      bobotElastis: prefs.bobotElastis,
      bobotPrinting: prefs.bobotPrinting,
      bobotTebal: prefs.bobotTebal,
      bobotKeawetan: prefs.bobotKeawetan ?? 3,
      bobotQuickDry: prefs.bobotQuickDry ?? 3,
      anggaranMaks: prefs.anggaranMaks,
      arahC5: prefs.arahC5,
    }

    const res = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(2500),
    })

    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) {
        return {
          rankedMaterials: json.data.rankedMaterials,
          excludedByBudget: json.data.excludedByBudget || [],
          normalizedWeights: json.data.normalizedWeights,
          isCalculationLive: true,
          isCalculatedByMicroservice: json.data.isCalculatedByMicroservice || false,
          source: json.data.isCalculatedByMicroservice ? 'spk_microservice' : 'backend_api',
        }
      }
    }
  } catch {
    // Backend offline, lanjutkan ke fallback lokal
  }

  // 2. Fallback ke kalkulasi in-browser (Client WP Engine)
  const filtered = prefs.anggaranMaks
    ? fallbackMaterials.filter(m => m.hargaDemo <= prefs.anggaranMaks!)
    : fallbackMaterials

  const excluded = prefs.anggaranMaks
    ? fallbackMaterials.filter(m => m.hargaDemo > prefs.anggaranMaks!)
    : []

  const criteria = buildCriteria(prefs)
  const alternatives = buildAlternatives(filtered)
  const output = calculateWP(criteria, alternatives)

  const rankedMaterials = output.results.map(r => ({
    id: r.id,
    rank: r.rank,
    S: r.S,
    V: r.V,
    material: fallbackMaterials.find(m => m.id === r.id)!,
  }))

  return {
    rankedMaterials,
    excludedByBudget: excluded,
    normalizedWeights: output.normalizedWeights,
    isCalculationLive: false,
    source: 'local_engine_fallback',
  }
}
