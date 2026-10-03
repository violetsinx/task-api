import { ZodError } from 'zod';

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError || err.details) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues ?? err.details ?? [],
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Duplicate field value violates unique constraint',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Resource not found',
    });
  }

  console.error(err);
  return res.status(500).json({
    error: 'Internal server error',
  });
}
