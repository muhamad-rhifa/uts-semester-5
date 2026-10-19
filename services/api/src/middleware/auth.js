export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Akses ditolak. Token otentikasi admin diperlukan.',
      },
    })
  }

  const token = authHeader.split(' ')[1]

  // Validasi token (Phase 4 mock token atau Bearer token)
  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token otentikasi tidak valid atau telah kedaluwarsa.',
      },
    })
  }

  // Token valid -> lampirkan admin user ke req
  req.admin = {
    id: 1,
    username: 'admin',
    role: 'administrator',
  }

  next()
}
