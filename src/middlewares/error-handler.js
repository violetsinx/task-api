export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.status) {
    return res.status(error.status).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
}
