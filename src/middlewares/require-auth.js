import { verifyAccessToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const authHeader =
    req.headers?.authorization ??
    (typeof req.get === 'function' ? req.get('authorization') : undefined);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (typeof res.status === 'function') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return undefined;
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    req.authToken = token;
    return next();
  } catch {
    if (typeof res.status === 'function') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return undefined;
  }
}
