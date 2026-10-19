import test from 'node:test'
import assert from 'node:assert/strict'
import app from './app.js'

let server
let baseUrl

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      const port = server.address().port
      baseUrl = `http://localhost:${port}`
      resolve()
    })
  })
})

test.after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve))
  }
})

test('GET /api/health mengembalikan status ok dan informasi database', async () => {
  const res = await fetch(`${baseUrl}/api/health`)
  assert.equal(res.status, 200)

  const json = await res.json()
  assert.equal(json.status, 'ok')
  assert.equal(json.service, 'viajersey-api')
  assert.ok(json.database)
})

test('GET /api/materials mengembalikan daftar bahan aktif', async () => {
  const res = await fetch(`${baseUrl}/api/materials`)
  assert.equal(res.status, 200)

  const json = await res.json()
  assert.equal(json.success, true)
  assert.ok(Array.isArray(json.data))
  assert.ok(json.data.length >= 5)

  const milano = json.data.find(m => m.id === 'FAB-001')
  assert.ok(milano)
  assert.equal(milano.nama, 'Dryfit Milano')
  assert.equal(milano.hargaDemo, 45000)
})

test('GET /api/materials/:slugOrId mengembalikan detail bahan atau 404 jika tidak ada', async () => {
  const resOk = await fetch(`${baseUrl}/api/materials/dryfit-milano`)
  assert.equal(resOk.status, 200)
  const jsonOk = await resOk.json()
  assert.equal(jsonOk.data.id, 'FAB-001')

  const res404 = await fetch(`${baseUrl}/api/materials/bahan-khayalan-999`)
  assert.equal(res404.status, 404)
  const json404 = await res404.json()
  assert.equal(json404.success, false)
  assert.equal(json404.error.code, 'NOT_FOUND')
})

test('POST /api/recommendations menghitung WP 7 kriteria dan mengembalikan urutan ranking', async () => {
  const body = {
    bobotHarga: 5,
    bobotSerap: 4,
    bobotElastis: 3,
    bobotPrinting: 4,
    bobotTebal: 3,
    bobotKeawetan: 3,
    bobotQuickDry: 4,
    anggaranMaks: null,
  }

  const res = await fetch(`${baseUrl}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  assert.equal(res.status, 200)
  const json = await res.json()
  assert.equal(json.success, true)
  assert.ok(Array.isArray(json.data.rankedMaterials))
  assert.ok(json.data.rankedMaterials.length >= 5)
  assert.equal(json.data.rankedMaterials[0].rank, 1)
  assert.ok(json.data.rankedMaterials[0].V > 0)
  assert.equal(json.data.isCalculationLive, true)
  assert.ok(json.data.normalizedWeights.C1 > 0)
  assert.ok(json.data.normalizedWeights.C6 > 0)
  assert.ok(json.data.normalizedWeights.C7 > 0)
})

test('POST /api/recommendations memisahkan bahan di luar anggaran', async () => {
  const res = await fetch(`${baseUrl}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bobotHarga: 3,
      bobotSerap: 3,
      bobotElastis: 3,
      bobotPrinting: 3,
      bobotTebal: 3,
      anggaranMaks: 20000, // Di bawah harga termurah (35000)
    }),
  })

  assert.equal(res.status, 200)
  const json = await res.json()
  assert.equal(json.data.rankedMaterials.length, 0)
  assert.ok(json.data.excludedByBudget.length >= 5)
})

test('POST /api/admin/auth/login memverifikasi kredensial dan menerbitkan token', async () => {
  // Login salah
  const resWrong = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
  })
  assert.equal(resWrong.status, 401)

  // Login benar
  const resOk = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  })
  assert.equal(resOk.status, 200)
  const jsonOk = await resOk.json()
  assert.ok(jsonOk.data.token)
  assert.equal(jsonOk.data.admin.username, 'admin')
})

test('Endpoint admin dilindungi oleh otentikasi Bearer token', async () => {
  // Tanpa token -> 401
  const resNoAuth = await fetch(`${baseUrl}/api/admin/dashboard`)
  assert.equal(resNoAuth.status, 401)

  // Dengan token -> 200
  const resAuth = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: { Authorization: 'Bearer valid_test_token' },
  })
  assert.equal(resAuth.status, 200)
  const jsonAuth = await resAuth.json()
  assert.ok(jsonAuth.data.totalBahan >= 5)
  assert.equal(jsonAuth.data.kriteriaAktif, 7)
})

test('Admin CRUD: Tambah dan Hapus bahan alternatif', async () => {
  const token = 'Bearer valid_test_token'

  // Tambah
  const newMat = {
    nama: 'Dryfit Corak Test',
    hargaDemo: 48000,
    deskripsi: 'Bahan uji untuk integrasi API',
    kelebihan: ['Bahan uji'],
    serapKeringat: 4,
    elastisitas: 4,
    printing: 4,
    ketebalan: 3,
    keawetan: 4,
    quickDry: 4,
  }

  const resPost = await fetch(`${baseUrl}/api/admin/materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(newMat),
  })
  assert.equal(resPost.status, 201)
  const jsonPost = await resPost.json()
  const createdId = jsonPost.data.id
  assert.ok(createdId)

  // Hapus
  const resDelete = await fetch(`${baseUrl}/api/admin/materials/${createdId}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  })
  assert.equal(resDelete.status, 200)
})

test('Admin Kriteria & Bobot: Edit bobot dan arah kriteria C5', async () => {
  const token = 'Bearer valid_test_token'

  const resPut = await fetch(`${baseUrl}/api/admin/criteria/C5`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      bobotDefault: 4,
      tipe: 'cost', // Diubah menjadi cost (kain tipis lebih diutamakan)
      deskripsi: 'Uji arah cost',
    }),
  })

  assert.equal(resPut.status, 200)
  const jsonPut = await resPut.json()
  assert.equal(jsonPut.data.bobotDefault, 4)
  assert.equal(jsonPut.data.tipe, 'cost')
})
