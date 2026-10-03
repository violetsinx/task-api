export function requireAuth(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ') || authorization.length <= 7) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.authToken = authorization.slice(7);
  return next();
}
