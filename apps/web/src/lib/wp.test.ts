import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateWP, buildCriteria, buildAlternatives, type Criterion, type AlternativeRow } from './wp.ts'
import { MATERIALS_FIXTURE } from '../data/fixtures.ts'

test('Kalkulasi WP: normalisasi bobot', () => {
  const criteria: Criterion[] = [
    { id: 'C1', type: 'cost', weight: 5 },
    { id: 'C2', type: 'benefit', weight: 5 },
  ]
  const alternatives: AlternativeRow[] = [
    { id: 'A1', values: { C1: 10, C2: 20 } },
    { id: 'A2', values: { C1: 20, C2: 40 } },
  ]

  const output = calculateWP(criteria, alternatives)

  // Total bobot = 10, w1 = 0.5, w2 = 0.5
  assert.equal(output.normalizedWeights.C1, 0.5)
  assert.equal(output.normalizedWeights.C2, 0.5)
  assert.equal(output.isDemo, true)
})

test('Kalkulasi WP: perhitungan matematis acuan (manual benchmark)', () => {
  // Contoh acuan:
  // Kriteria C1 (Cost, weight 1 -> w = 0.5, exp = -0.5)
  // Kriteria C2 (Benefit, weight 1 -> w = 0.5, exp = +0.5)
  //
  // Alt 1: C1 = 4, C2 = 9
  // S1 = (4 ^ -0.5) * (9 ^ 0.5) = (1/2) * 3 = 1.5
  //
  // Alt 2: C1 = 16, C2 = 4
  // S2 = (16 ^ -0.5) * (4 ^ 0.5) = (1/4) * 2 = 0.5
  //
  // Total S = 1.5 + 0.5 = 2.0
  // V1 = 1.5 / 2.0 = 0.75 (Rank 1)
  // V2 = 0.5 / 2.0 = 0.25 (Rank 2)

  const criteria: Criterion[] = [
    { id: 'C1', type: 'cost', weight: 1 },
    { id: 'C2', type: 'benefit', weight: 1 },
  ]
  const alternatives: AlternativeRow[] = [
    { id: 'A1', values: { C1: 4, C2: 9 } },
    { id: 'A2', values: { C1: 16, C2: 4 } },
  ]

  const output = calculateWP(criteria, alternatives)

  assert.equal(output.results.length, 2)

  const r1 = output.results.find(r => r.id === 'A1')!
  const r2 = output.results.find(r => r.id === 'A2')!

  assert.ok(Math.abs(r1.S - 1.5) < 1e-9, `S1 expected 1.5, got ${r1.S}`)
  assert.ok(Math.abs(r2.S - 0.5) < 1e-9, `S2 expected 0.5, got ${r2.S}`)
  assert.ok(Math.abs(r1.V - 0.75) < 1e-9, `V1 expected 0.75, got ${r1.V}`)
  assert.ok(Math.abs(r2.V - 0.25) < 1e-9, `V2 expected 0.25, got ${r2.V}`)

  assert.equal(r1.rank, 1)
  assert.equal(r2.rank, 2)
  assert.equal(output.results[0].id, 'A1')
  assert.equal(output.results[1].id, 'A2')
})

test('Kalkulasi WP: validasi nilai non-positif harus gagal', () => {
  const criteria: Criterion[] = [
    { id: 'C1', type: 'benefit', weight: 3 },
  ]

  // Nilai 0
  assert.throws(() => {
    calculateWP(criteria, [{ id: 'A1', values: { C1: 0 } }])
  }, /Harus positif/)

  // Nilai negatif
  assert.throws(() => {
    calculateWP(criteria, [{ id: 'A1', values: { C1: -5 } }])
  }, /Harus positif/)

  // Nilai missing
  assert.throws(() => {
    calculateWP(criteria, [{ id: 'A1', values: {} }])
  }, /tidak ditemukan/)
})

test('Kalkulasi WP: validasi bobot non-positif harus gagal', () => {
  assert.throws(() => {
    calculateWP(
      [{ id: 'C1', type: 'benefit', weight: 0 }],
      [{ id: 'A1', values: { C1: 10 } }]
    )
  }, /Harus positif/)

  assert.throws(() => {
    calculateWP(
      [{ id: 'C1', type: 'benefit', weight: -2 }],
      [{ id: 'A1', values: { C1: 10 } }]
    )
  }, /Harus positif/)
})

test('Kalkulasi WP: integrasi 7 kriteria lengkap pada semua bahan', () => {
  const criteria = buildCriteria({
    bobotHarga: 5,
    bobotSerap: 4,
    bobotElastis: 3,
    bobotPrinting: 4,
    bobotTebal: 3,
    bobotKeawetan: 3,
    bobotQuickDry: 4,
    arahC5: 'benefit',
  })

  assert.equal(criteria.length, 7)
  assert.equal(criteria.find(c => c.id === 'C6')?.type, 'benefit')
  assert.equal(criteria.find(c => c.id === 'C7')?.type, 'benefit')

  const alternatives = buildAlternatives(MATERIALS_FIXTURE)
  assert.equal(alternatives.length, 5)

  for (const alt of alternatives) {
    assert.ok(alt.values.C1 > 0)
    assert.ok(alt.values.C2 >= 1 && alt.values.C2 <= 5)
    assert.ok(alt.values.C3 >= 1 && alt.values.C3 <= 5)
    assert.ok(alt.values.C4 >= 1 && alt.values.C4 <= 5)
    assert.ok(alt.values.C5 >= 1 && alt.values.C5 <= 5)
    assert.ok(alt.values.C6 >= 1 && alt.values.C6 <= 5)
    assert.ok(alt.values.C7 >= 1 && alt.values.C7 <= 5)
  }

  const output = calculateWP(criteria, alternatives)
  assert.equal(output.results.length, 5)

  const sumV = output.results.reduce((acc, r) => acc + r.V, 0)
  assert.ok(Math.abs(sumV - 1.0) < 1e-6, `Sum of V should equal 1.0, got ${sumV}`)

  // Normalisasi bobot berjumlah 1.0
  const sumW = Object.values(output.normalizedWeights).reduce((a, b) => a + b, 0)
  assert.ok(Math.abs(sumW - 1.0) < 1e-6, `Sum of weights should equal 1.0, got ${sumW}`)
})

