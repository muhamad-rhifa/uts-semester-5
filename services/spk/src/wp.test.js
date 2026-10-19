import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateWeightedProduct } from './wpEngine.js'
import app from './app.js'

// ====================================================================
// 1. UNIT TEST: PERHITUNGAN MATEMATIS ACUAN MANUAL (MANUAL BENCHMARK)
// ====================================================================
test('WP Engine: manual benchmark matematis presisi tinggi', () => {
  // Model uji matematis acuan:
  // C1 (Cost, W = 2), C2 (Benefit, W = 2)
  // Total W = 4 -> w1 = 0.5 (exp = -0.5), w2 = 0.5 (exp = +0.5)
  // A1: C1=4, C2=9   -> S1 = 4^(-0.5) * 9^(0.5) = 0.5 * 3 = 1.5
  // A2: C1=16, C2=4  -> S2 = 16^(-0.5) * 4^(0.5) = 0.25 * 2 = 0.5
  // Total S = 2.0
  // V1 = 1.5 / 2.0 = 0.75 (Rank 1)
  // V2 = 0.5 / 2.0 = 0.25 (Rank 2)

  const criteria = [
    { id: 'C1', type: 'cost', weight: 2 },
    { id: 'C2', type: 'benefit', weight: 2 },
  ]
  const alternatives = [
    { id: 'A1', values: { C1: 4, C2: 9 } },
    { id: 'A2', values: { C1: 16, C2: 4 } },
  ]

  const output = calculateWeightedProduct(criteria, alternatives)

  // Normalisasi bobot
  assert.equal(output.normalizedWeights.C1, 0.5)
  assert.equal(output.normalizedWeights.C2, 0.5)

  // Nilai Vektor S
  const r1 = output.results.find(r => r.id === 'A1')
  const r2 = output.results.find(r => r.id === 'A2')
  assert.ok(Math.abs(r1.S - 1.5) < 1e-9, `S1 acuan 1.5, aktual ${r1.S}`)
  assert.ok(Math.abs(r2.S - 0.5) < 1e-9, `S2 acuan 0.5, aktual ${r2.S}`)

  // Nilai Preferensi V
  assert.ok(Math.abs(r1.V - 0.75) < 1e-9, `V1 acuan 0.75, aktual ${r1.V}`)
  assert.ok(Math.abs(r2.V - 0.25) < 1e-9, `V2 acuan 0.25, aktual ${r2.V}`)

  // Urutan Ranking
  assert.equal(output.results[0].id, 'A1')
  assert.equal(output.results[0].rank, 1)
  assert.equal(output.results[1].id, 'A2')
  assert.equal(output.results[1].rank, 2)
})

// ====================================================================
// 2. UNIT TEST: 7 KRITERIA LENGKAP VIAJERSEY
// ====================================================================
test('WP Engine: kalkulasi 7 kriteria lengkap (C1 s.d. C7)', () => {
  const criteria = [
    { id: 'C1', type: 'cost', weight: 5 },
    { id: 'C2', type: 'benefit', weight: 4 },
    { id: 'C3', type: 'benefit', weight: 3 },
    { id: 'C4', type: 'benefit', weight: 4 },
    { id: 'C5', type: 'benefit', weight: 3 },
    { id: 'C6', type: 'benefit', weight: 3 },
    { id: 'C7', type: 'benefit', weight: 4 },
  ]

  const alternatives = [
    {
      id: 'FAB-001',
      values: { C1: 45000, C2: 4, C3: 4, C4: 4, C5: 3, C6: 4, C7: 4 },
    },
    {
      id: 'FAB-002',
      values: { C1: 40000, C2: 3, C3: 4, C4: 4, C5: 3, C6: 4, C7: 3 },
    },
    {
      id: 'FAB-005',
      values: { C1: 52000, C2: 5, C3: 4, C4: 5, C5: 2, C6: 5, C7: 5 },
    },
  ]

  const output = calculateWeightedProduct(criteria, alternatives)

  // 1. Seluruh 7 kriteria ternormalisasi
  const sumW = Object.values(output.normalizedWeights).reduce((a, b) => a + b, 0)
  assert.ok(Math.abs(sumW - 1.0) < 1e-9, `Total bobot ternormalisasi harus 1.0, aktual ${sumW}`)

  // 2. Jumlah nilai V seluruh alternatif harus 1.0 (100%)
  const sumV = output.results.reduce((a, b) => a + b.V, 0)
  assert.ok(Math.abs(sumV - 1.0) < 1e-9, `Total V seluruh alternatif harus 1.0, aktual ${sumV}`)

  // 3. Peringkat 1 memiliki V terbesar
  assert.equal(output.results[0].rank, 1)
  assert.ok(output.results[0].V >= output.results[1].V)
  assert.ok(output.results[1].V >= output.results[2].V)
})

// ====================================================================
// 3. UNIT TEST: PENANGANAN KONDISI SERI (TIE-BREAKING)
// ====================================================================
test('WP Engine: penanganan kondisi seri deterministik', () => {
  const criteria = [
    { id: 'C1', type: 'cost', weight: 3 },
    { id: 'C2', type: 'benefit', weight: 3 },
  ]
  // Dua alternatif dengan nilai identik
  const alternatives = [
    { id: 'B-Kain', values: { C1: 40000, C2: 4 } },
    { id: 'A-Kain', values: { C1: 40000, C2: 4 } },
  ]

  const output = calculateWeightedProduct(criteria, alternatives)

  assert.equal(output.results.length, 2)
  assert.equal(output.results[0].V, output.results[1].V)
  // Deterministic sorting by id ascending jika nilai V sama
  assert.equal(output.results[0].id, 'A-Kain')
  assert.equal(output.results[1].id, 'B-Kain')
})

// ====================================================================
// 4. UNIT TEST: VALIDASI NILAI ERROR & KEAMANAN
// ====================================================================
test('WP Engine: validasi menolak bobot nol atau negatif', () => {
  assert.throws(() => {
    calculateWeightedProduct(
      [{ id: 'C1', type: 'cost', weight: 0 }],
      [{ id: 'A1', values: { C1: 1000 } }]
    )
  }, /angka positif lebih dari 0/)

  assert.throws(() => {
    calculateWeightedProduct(
      [{ id: 'C1', type: 'cost', weight: -3 }],
      [{ id: 'A1', values: { C1: 1000 } }]
    )
  }, /angka positif lebih dari 0/)
})

test('WP Engine: validasi menolak nilai alternatif non-positif atau hilang', () => {
  const criteria = [{ id: 'C1', type: 'benefit', weight: 3 }]

  // Nilai 0
  assert.throws(() => {
    calculateWeightedProduct(criteria, [{ id: 'A1', values: { C1: 0 } }])
  }, /angka positif > 0/)

  // Nilai negatif
  assert.throws(() => {
    calculateWeightedProduct(criteria, [{ id: 'A1', values: { C1: -50 } }])
  }, /angka positif > 0/)

  // Nilai hilang
  assert.throws(() => {
    calculateWeightedProduct(criteria, [{ id: 'A1', values: {} }])
  }, /tidak ditemukan/)
})

// ====================================================================
// 5. INTEGRATION TEST: HTTP API EXPRESS SPK SERVICE
// ====================================================================
let server
let baseUrl

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`
      resolve()
    })
  })
})

test.after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve))
  }
})

test('HTTP GET /health mengembalikan status service', async () => {
  const res = await fetch(`${baseUrl}/health`)
  assert.equal(res.status, 200)
  const json = await res.json()
  assert.equal(json.status, 'ok')
  assert.equal(json.service, 'viajersey-spk-engine')
})

test('HTTP POST /calculate memproses kalkulasi WP via API', async () => {
  const payload = {
    criteria: [
      { id: 'C1', type: 'cost', weight: 5 },
      { id: 'C2', type: 'benefit', weight: 4 },
      { id: 'C3', type: 'benefit', weight: 3 },
      { id: 'C4', type: 'benefit', weight: 4 },
      { id: 'C5', type: 'cost', weight: 3 }, // Uji C5 mode cost
      { id: 'C6', type: 'benefit', weight: 3 },
      { id: 'C7', type: 'benefit', weight: 4 },
    ],
    alternatives: [
      { id: 'FAB-001', values: { C1: 45000, C2: 4, C3: 4, C4: 4, C5: 3, C6: 4, C7: 4 } },
      { id: 'FAB-002', values: { C1: 40000, C2: 3, C3: 4, C4: 4, C5: 3, C6: 4, C7: 3 } },
      { id: 'FAB-003', values: { C1: 38000, C2: 3, C3: 3, C4: 3, C5: 4, C6: 3, C7: 3 } },
    ],
  }

  const res = await fetch(`${baseUrl}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  assert.equal(res.status, 200)
  const json = await res.json()
  assert.equal(json.success, true)
  assert.ok(json.data.results.length === 3)
  assert.equal(json.data.results[0].rank, 1)
  assert.ok(json.data.isCalculatedByMicroservice, true)
})
