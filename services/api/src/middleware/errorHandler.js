export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rute '${req.method} ${req.originalUrl}' tidak ditemukan.`,
    },
  })
}

export function errorHandler(err, req, res, next) {
  console.error('[API Error]', err)

  const statusCode = err.statusCode || 500
  const errorCode = err.code || 'INTERNAL_ERROR'
  const message =
    statusCode === 500
      ? 'Terjadi kesalahan internal pada server. Silakan coba lagi nanti.'
      : err.message

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  })
}
